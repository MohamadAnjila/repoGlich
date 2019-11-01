const express = require('express');
const fs = require('fs');

// We're using the Better-SQLite3 NPM module as a database.
// Documentation: https://github.com/JoshuaWise/better-sqlite3/wiki/API
const Database = require('better-sqlite3');

// If you want to reset to a clean database, uncomment this line for a second or two:
//fs.unlinkSync('.data/sqlite3.db');
const db = new Database('.data/sqlite3.db');

// Make sure tables and initial data exist in the database
db.exec(fs.readFileSync('schema.sql').toString());

// Create the subrouter, and set it as the default export
const router = express.Router();
module.exports = router;


router.use(function(req,rsp,next) {
  // Delay all request for 0.5s, to simulate latency.
  setTimeout(next, 500);
});



/*
 * The actual API routers...
 */


router.get('/lists', function(req,rsp) {
  rsp.json(db.prepare('select * from lists').all());
});


router.post('/lists', function(req,rsp) {
  let name = req.body.name;
  if (typeof name !== 'string') {
    return rsp.status(400).json({error: "Invalid name"});
  }

  let info = db.prepare('insert into lists(name) values(?)').run(name);
  let id = info.lastInsertRowid;
  return rsp.status(201).json({id, name});
});

function readList(listId,rsp) {
  let list = db.prepare('select * from lists where id=?').get(listId);
  if (list) return list;
  rsp.status(404).json({error: "No such list"});
}


router.get('/lists/:listId/items', function(req,rsp) {
  if (!readList(req.params.listId, rsp)) return;
    return rsp.json(
      db.prepare('select * from items where listId=?')
        .all(req.params.listId)
        .map(itemFromDb)
    );
});


router.post('/lists/:listId/items', function(req,rsp) {
  if (!readList(req.params.listId, rsp)) return;
  
  let item = itemToDb(req.body, {priority: 1, checked: 0}, rsp);
  if (!item) return;
  
  item.listId = req.params.listId;
  
  let info = db.prepare('insert into items(listId,name,priority,checked) values(:listId, :name, :priority, :checked)').run(item);
  item.id = info.lastInsertRowid;
  
  rsp.status(201).json(itemFromDb(item));
});


router.use(function(req,rsp,next) {
  // Delay the following request for an additional 500ms, to simulate latency:
  // The UI should not have to wait for these requests to succeed.
  setTimeout(next, 500);
});


router.delete('/lists/:listId', function(req,rsp) {
  let info = db.prepare('delete from lists where id=?').run(req.params.listId);
  if (!info.changes) return rsp.status(404).json({error: "No such list"});
  db.prepare('delete from items where listId=?').run(req.params.listId);
  rsp.json({});
});


router.delete('/lists/:listId/items/:itemId', function(req,rsp) {
  let info = db.prepare('delete from items where id=? and listId=?').run(req.params.itemId, req.params.listId);
  if (info.changes) rsp.status(200).json({}); // success!
  else rsp.status(404).json({error: "No such item"});
});


router.put('/lists/:listId/items/:itemId', function(req,rsp) {
  let item = db.prepare('select * from items where id=? and listId=?').get(req.params.itemId, req.params.listId);
  if (!item) return rsp.status(404).json({error: "No such item"});
  
  item = itemToDb(req.body, item, rsp);
  if (!item) return;
  
  db.prepare('update items set name=:name, priority=:priority, checked=:checked where id=:id').run(item);
  rsp.status(200).json(itemFromDb(item));
});


// Exceptions are internal errors
router.use(function(error,req,rsp,next) {
  rsp.status(500).json({error: 'Internal server error: '+error});        
});


// Catch-all rule for non-existing routes
router.use(function(req,rsp){
  rsp.status(404).json({error: "No such API route"});
});


/*
 * A couple of helper functions...
 */



/** Converts a request `body` to an database item record, using `defaults` to fill
 * in the blanks. If there's an error, it's send to `rsp` and `undefined` is return.
 * Otherwise the item record object is returned.
 */
function itemToDb(body, defaults, rsp) {
  let item = Object.assign({}, defaults); // clone defaults
  
  if (body.name!=null) {
    item.name = body.name;
  }
  if (typeof item.name!=='string') {
    rsp.status(400).json({error: "Invalid name"});
  }
  
  if (body.priority==='low') item.priority = 0;
  else if (body.priority==='medium') item.priority = 1;
  else if (body.priority==='high') item.priority = 2;
  else if (body.priority!=null || item.priority==null) {
    rsp.status(400).json({error: "Invalid priority"});
    return;
  }

  if (body.checked===true) item.checked = 1;
  else if (body.checked===false) item.checked = 0;
  else if (body.checked!=null || item.checked==null) {
    rsp.status(400).json({error: "Invalid checked status"});
    return;
  }
  
  return item;
}


function itemFromDb(record) {
  return {
    id: record.id,
    name: record.name,
    priority: {0:'low', 1:'medium', 2:'high'}[record.priority],
    checked: !!record.checked
  };
}



