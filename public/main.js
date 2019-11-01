// As we'll be calling the glasgow function constantly, we'll give it a short and special name:
import gg from "https://cdn.jsdelivr.net/npm/glasgow@0.9/glasgow.js";

let response1 = [];
let responseListItems = [];
let createItem = [];
let childSpecialNavItem = [];
let priorityMedium = [];
let priorityhigh = [];
let prioritylow = [];

getData(
  "GET",
  "/lists",
  function(rsp) {
    response1 = rsp;
  },
  false
);
//soort the list
response1.sort(listSoort);

function listSoort(a, b) {
  var nameA = a.name.toUpperCase(); // ignore upper and lowercase
  var nameB = b.name.toUpperCase(); // ignore upper and lowercase
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  // names must be equal
  return 0;
}

function getData(request, url, callback, async) {
  let xhr = new XMLHttpRequest();

  xhr.open(request, "/api/" + url, async);
  if (request === "PUT") {
    xhr.send();
  }
  xhr.addEventListener("load", function() {
    let response = JSON.parse(xhr.responseText);
    // console.log("response", response);
    callback(response);
    return response;
  });

  xhr.send();
}

function postData(request, url, data, callback) {
  let xhr = new XMLHttpRequest();

  xhr.open(request, "/api/" + url, true);
  xhr.addEventListener("load", function() {
    let response = JSON.parse(xhr.responseText);
    console.log("response", response);
    callback(response);
    // response1.push(response);
    gg.refresh();
  });
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.send(JSON.stringify(data));
}

function deleteData(url) {
  let xhr = new XMLHttpRequest();

  xhr.open("DELETE", "/api/" + url, true);
  xhr.addEventListener("load", function() {
    let response = JSON.parse(xhr.responseText);
    console.log("response", response);
    // callback(response);
  });
  xhr.send();
}

function callback1(response) {
  responseListItems = response;
}

class Main1 {
  start() {}
  render() {
    return gg(
      "main",
      gg(
        "nav",
        gg(SpecialNavElement),
        response1.map(item =>
          gg(navItem, { name: item.name, id: item.id, item })
        )
      ),
      childSpecialNavItem.map(listItem => gg(AddNewListCard)),
      gg(
        "div",
        createItem.map(listItem =>
          gg(Specialcard, {
            listItem,
            response1,
            priorityMedium,
            priorityhigh,
            prioritylow,
            createItem
          })
        ),
        createItem.map(listItem => gg("section.card", "high")),
        gg(
          "div",
          priorityhigh.map((listItem, index) =>
            gg(card, {
              name: listItem.name,
              checked: listItem.checked,
              priority: listItem.priority,
              responseListItems: priorityhigh,
              index,
              listItem
            })
          )
        ),
        gg("div", createItem.map(listItem => gg("section.card", "Medium"))),
        gg(
          "div",
          priorityMedium.map((listItem, index) =>
            gg(card, {
              name: listItem.name,
              checked: listItem.checked,
              priority: listItem.priority,
              responseListItems: priorityMedium,
              index,
              listItem
            })
          )
        ),
        gg("div", createItem.map(listItem => gg("section.card", "low"))),
        gg(
          "div",
          prioritylow.map((listItem, index) =>
            gg(card, {
              name: listItem.name,
              checked: listItem.checked,
              priority: listItem.priority,
              responseListItems: prioritylow,
              index,
              listItem
            })
          )
        )
      )
    );
  }
}

class AddNewListCard {
  render() {
    return gg(
      "section.card",
      gg("h2", "Create a new list"),
      gg(
        "div.inputRow",
        gg("input", {
          type: "text",
          placeholder: "Name",
          autofocus: "autofocus",
          binding: "$listName"
        })
      ),
      gg("div.buttonRow", gg("button", "Add", { onclick: this.addnewList }))
    );
  }
  addnewList() {
    postData("POST", "lists", { name: this.$listName }, function(res) {
      response1.push(res);
      response1.sort(listSoort);
    });
    gg.refresh();
  }
}

class SpecialNavElement {
  render() {
    return gg(
      "a.active",
      { id: "special", onclick: this.addNewListCard },
      gg("i.material-icons", "note_add")
    );
  }
  addNewListCard() {
    createItem = [];
    responseListItems = [];
    priorityMedium = [];
    priorityhigh = [];
    prioritylow = [];
    childSpecialNavItem = [];
    childSpecialNavItem.push("1");
  }
}

class Specialcard {
  render() {
    return gg(
      "section.card special",
      gg(
        "div.inputRow",
        gg("i.material-icons", "delete", { onclick: this.delete }),
        gg("button", "Add an item", { onclick: this.add })
      )
    );
  }
  delete() {
    var removeIndex = this.response1
      .map(item => {
        return item.id;
      })
      .indexOf(this.listItem.id);
    // remove object

    this.response1.splice(removeIndex, 1);
    gg.refresh();
    //remove the list from the database

    deleteData("lists/" + createItem[0].id);

    document.getElementById("special").click();

    //clean the array
    this.responseListItems.length = 0;
    this.createItem.length = 0;
    this.priorityMedium.length = 0;
    this.priorityhigh.length = 0;
    this.prioritylow.length = 0;
  }
  add() {
    gg.mount(document.body, () => {
      return gg(
        "div.modalBg",
        gg(
          "div.modal",
          gg("h2", "Add an item"),
          gg(
            "div.inputRow",
            gg("input", {
              type: "text",
              placeholder: "Name",
              autofocus: "autofocus",
              binding: "$listItemName"
            }),
            gg("input", {
              type: "number",
              placeholder: "priority 1 or 2 or 3",
              autofocus: "autofocus",
              binding: "$priority"
            })
          ),
          gg(
            "div.buttonRow",
            gg("button", "Cancel", { onclick: this.removeWindow }),
            gg("button.primary", "Create", { onclick: this.createList })
          )
        )
      );
    });
  }

  removeWindow() {
    document.body.removeChild(document.body.lastElementChild);
  }
  createList() {
    if (this.$priority != 1 && this.$priority != 2 && this.$priority != 3) {
      alert("you should to input a valid priority");
    } else if (this.$priority == 1) {
      prioritylow.push({
        name: this.$listItemName
      });
      // location.reload();
      gg.refresh();
      //edit hardcoded id to id from list
      postData("POST", "lists/" + createItem[0].id + "/items", {
        name: this.$listItemName,
        priority: "low"
      });
      document.body.removeChild(document.body.lastElementChild);
    } else if (this.$priority == 2) {
      priorityMedium.push({
        name: this.$listItemName,
        priority: "medium"
      });
      // location.reload();
      gg.refresh();
      //edit hardcoded id to id from list
      postData("POST", "lists/" + createItem[0].id + "/items", {
        name: this.$listItemName,
        priority: "medium"
      });
      document.body.removeChild(document.body.lastElementChild);
    } else if (this.$priority == 3) {
      priorityhigh.push({
        name: this.$listItemName,
        priority: "high"
      });
      // location.reload();
      gg.refresh();
      //edit hardcoded id to id from list
      postData("POST", "lists/" + createItem[0].id + "/items", {
        name: this.$listItemName,
        priority: "high"
      });
      document.body.removeChild(document.body.lastElementChild);
    }
  }
}

class card {
  start() {
    let name = this.$name;
    let checked = this.$checked;
  }
  render() {
    let checkBox = "";
    if (this.checked === true) {
      checkBox = "check_box";
    } else {
      checkBox = "check_box_outline_blank";
    }
    return gg(
      "section.card",
      gg(
        "div.inputRow",
        { id: this.index },
        gg("i.material-icons", checkBox, {
          onclick: function() {
            if (this.checked === true) {
              this.responseListItems[this.index].checked = false;
              //update the data in the database
              postData(
                "PUT",
                "/lists/" + createItem[0].id + "/items/" + this.listItem.id,
                { checked: false }
              );
              // location.reload();

              gg.refresh();
            } else if (this.checked === false) {
              this.responseListItems[this.index].checked = true;
              //update the data in the database
              postData(
                "PUT",
                "/lists/" + createItem[0].id + "/items/" + this.listItem.id,
                { checked: true }
              );
              gg.refresh();
              // location.reload();
            }
          }
        }),
        gg("label", this.name),
        gg("i.material-icons", "edit", { onclick: this.showEditWindow })
      )
    );
  }

  showEditWindow() {
    gg.mount(document.body, () => {
      return gg(editWindow, {
        item: this.listItem,
        priority: this.priority,
        index: this.index,
        responseListItems: this.responseListItems
      });
    });
  }
}

class editWindow {
  render() {
    return gg(
      "div.modalBg",
      gg(
        "div.modal",
        gg("h2", "editItem"),
        gg(
          "div.inputRow",
          gg("input", {
            type: "text",
            placeholder: this.item.name,
            binding: "$itemName",
            autofocus: "autofocus"
          })
        ),
        gg(
          "div.inputRow",
          gg("input", {
            type: "text",
            placeholder: "priority high or medium or low",
            binding: "$priority1",
            autofocus: "autofocus"
          })
        ),
        gg(
          "div.buttonRow",
          gg("i.material-icons", "delete", {
            onclick: this.delete
          }),
          gg("button", "Cancel", { onclick: this.cancel }),
          gg("button.primary", "Save", { onclick: this.save })
        )
      )
    );
  }
  cancel() {
    document.body.removeChild(document.body.lastElementChild);
  }
  save() {
    if (this.$priority1 == this.priority) {
      this.responseListItems[this.index].name = this.$itemName;
      //update the data in the database
      postData("PUT", "/lists/" + createItem[0].id + "/items/" + this.item.id, {
        name: this.$itemName
      });
      gg.refresh();
      document.body.removeChild(document.body.lastElementChild);
    } else {
      if (this.$priority1 != this.priority && this.$priority1 == "medium") {
        //delete from the array and add it to the new array
        this.responseListItems.splice(this.index, 1);
        priorityMedium.push({
          name: this.$itemName,
          priority: this.$priority1
        });
        postData(
          "PUT",
          "/lists/" + createItem[0].id + "/items/" + this.item.id,
          {
            name: this.$itemName,
            priority: this.$priority1
          }
        );
        gg.refresh();
        document.body.removeChild(document.body.lastElementChild);
      } else if (
        this.$priority1 != this.priority &&
        this.$priority1 == "high"
      ) {
        //delete from the array and add it to the new array
        this.responseListItems.splice(this.index, 1);
        priorityhigh.push({
          name: this.$itemName,
          priority: this.$priority1
        });
        postData(
          "PUT",
          "/lists/" + createItem[0].id + "/items/" + this.item.id,
          {
            name: this.$itemName,
            priority: this.$priority1
          }
        );
        gg.refresh();
        document.body.removeChild(document.body.lastElementChild);
      } else if (this.$priority1 != this.priority && this.$priority1 == "low") {
        //delete from the array and add it to the new array
        this.responseListItems.splice(this.index, 1);
        prioritylow.push({
          name: this.$itemName,
          priority: this.$priority1
        });
        postData(
          "PUT",
          "/lists/" + createItem[0].id + "/items/" + this.item.id,
          {
            name: this.$itemName,
            priority: this.$priority1
          }
        );
        gg.refresh();
        document.body.removeChild(document.body.lastElementChild);
      } else {
        alert("you should to type valid priority low or high or medium");
      }
    }
  }
  delete() {
    this.responseListItems.splice(this.index, 1);
    //remove from the database
    deleteData("/lists/" + createItem[0].id + "/items/" + this.item.id);
    gg.refresh();
    // location.reload();
    document.body.removeChild(document.body.lastElementChild);
  }
}
class navItem {
  render() {
    return gg("a.active", this.name, { onclick: this.showItems });
  }
  showItems() {
    childSpecialNavItem = [];
    createItem = [];
    responseListItems = [];
    priorityMedium = [];
    priorityhigh = [];
    prioritylow = [];

    createItem.push(this.item);
    getData("Get", "lists/" + this.id + "/items", listItemsResponse, false);
  }
}

function listItemsResponse(response) {
  for (let item of response) {
    if (item.priority == "medium") {
      priorityMedium.push(item);
    } else if (item.priority == "high") {
      priorityhigh.push(item);
    } else if (item.priority == "low") {
      prioritylow.push(item);
    }
  }
}

// Show the main component
gg.mount(document.body, Main1);
