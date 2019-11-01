WebTech week 6 assignment
=========================

Create the front-end for a single page web application using Glasgow, a functional reactive UI library.

### How to work on the assignment

- *Remix* this project on Glitch.
- Make your cloned project private, by tapping its name in the top left corner and then toggling the lock icon. If you don't do this and other students copy your code, <em>you</em> may get into plagiarism-trouble as well.
- Work on the assignment, right here on Glitch.
- Hand in your work for grading using [this form](https://goo.gl/forms/s6CUNdqaaY8X5o802). You should do this only once and *before* the start of next week's lecture.
- You are allowed to work in pairs, doing [pair programming](https://en.wikipedia.org/wiki/Pair_programming).


### Requirements

Create an extended version of last week's ToDo app, this time based on Glasgow. As this is a pretty different way of creating and updating user interfaces, it's probably *not* helpful to start out with a copy of your code from last week. Except maybe the code you used for communicating with the API. 

To get an idea what to aim for, watch the [demo video](https://video.saxion.nl/media/t/1_40uhlf7h). (No audio.)

#### Functional

- **40 points ⇒** All of the functional requirements from week 5.
- **5 points ⇒** Tabs should always be ordered alphabetically.
- **5 points ⇒** The add/edit item modal should have an extra `<select>` element, for setting the item priority to low, medium or high.
- **5 points ⇒** Items in a ToDo-list are grouped by priority. First high, then medium, then low. Within a priority group, items are ordered by name.
- **5 points ⇒** Above each priority group, there is a label ('High', 'Medium' or 'Low'). Labels for empty priority groups are not shown.
- **5 points ⇒** A loading indicator (or message) should be shown while retrieving the lists and while retrieving the items. 
  
Learning goal: consider how you would implement these additions in last week's project, without Glasglow. Would your code still be maintainable?
  
#### Non-functional

- **MUST ⇒** Use Glasgow (already imported in `main.js`) for all user interface creation and manipulation.
- **MUST ⇒** Event handlers should only change the app state variables. DOM changes must be handled by Glasgow.
- **MUST ⇒** The user-interface should be the same as in the demo video, or clearly better. To that end, you can use the provided `style.css` file, and have a peek in the `static-html-examples` directory in assignment 5. 
- **MUST ⇒** Your app should run on recent versions of Chrome and Firefox.
- **10 points ⇒** Three Glasgow components should be used.
- **15 points ⇒** All changes (except switching tabs) should persist to the database using the provided REST API. Connection errors don't need to be handled. When reloading the site (on a different device) the state should be restored.
- **5 points ⇒** Data should be cached in the browser. When opening a list tab for the first time, it should load from the server. When switching to a different tab and then back, the list should show instantly without consulting the server again. All API calls have a 500ms delay to show the effect clearly.
- **5 points ⇒** All changes (except maybe item and list creation) should be reflected in the user-interface immediately, without waiting for a round-trip to the server. To help diagnose this, the provided REST API adds a 1s delay to all operations that should not reuire a round-trip before the UI is updated..
- **0 points ⇒** Animations (such as in the video) are not a requirement. If you want to look into them anyway, search the Glasgow manual for fadeIn/fadeOut. You may also want to look up the `key` attribute, if animations are not as expected.
- **0 points ⇒** You are not required to handle errors caused by multiple users/browsers interacting with your server simultaneously.
- **0 points ⇒** Connection errors don't need to be handled either.


#### Grading

The **MUST** requirements are entry conditions. For other requirements, points are awarded up to the specified maximum. The quality of the code used to fulfill a given requirement will be taken into account. The grade is calculated by summing the points and dividing by 10.


### Glasgow documentation

- [README.md](https://www.npmjs.com/package/glasgow)



### REST API documentation

- `GET /api/lists` — Get all lists.

  Status code 200. Response body example:
  ```js
  [
    {id: 1, name: "Groceries"},
    {id: 2, name: "Apollo Project"}
  ]
  ```

- `POST /api/lists` — Create a new list, returning the newly created item including its assigned id.

  Request body example:
  ```js
  {name: "WebTech"}
  ```
  Status code 201. Response body example:
  ```js
  {id: 3, name: "WebTech"}
  ```
  Status code 400. Response body example:
  ```js
  {error: "Invalid name"}
  ```
  
- `DELETE /api/lists/:listId` — Delete list `:listId`.
  
  Status code 200. Response body example:
  ```js
  {}
  ```
  Status code 404. Response body example:
  ```js
  {error: "No such list"}
  ```


- `GET /api/lists/:listId/items` — Get all items for list `listId`.

  Status code 200. Response body example:
  ```js
  [
    {id: 1, name: "Sugar", priority: 'medium', checked: false},
    {id: 2: name: "Milk", priority: 'high', checked: true}
  ]
  ```
  Status code 404. Response body example:
  ```js
  {error: "No such list"}
  ```
  

- `POST /api/lists/:listId/items` — Create a new item for list `listId`, returning the newly created item including its assigned id.

  Request body example:
  ```js
  {name: "Build a spaceship", priority: 'low'}
  ```
  Status code 201. Response body example:
  ```js
  {id: 1, name: "Build a spaceship", priority: 'low', checked: false}
  ```
  Status code 404. Response body example:
  ```js
  {error: "No such list"}
  ```
  Status code 400. Response body example:
  ```js
  {error: "Invalid name"}
  ```

  
- `DELETE /api/lists/:listId/items/:itemId` — Delete item `:itemId` of list `:listId`.
  
  Status code 200. Response body example:
  ```js
  {}
  ```
  Status code 404. Response body example:
  ```js
  {error: "No such item"}
  ```


- `PUT /api/lists/:listId/items/:itemId` — Change properties of item `:itemId` of list `:listId`, returning the new state of the item.

  Request body example:
  ```js
  {checked: true, name: "Build a HUGE spaceship"}
  ```
  Any combination of `checked`, `name` and `priority` can be specified. Unspecified properties will be kept at their current value.

  Status code 200. Response body example:
  ```js
  {id: 1, name: "Build a HUGE spaceship", priority: 'low', checked: true}
  ```
  Status code 404. Response body example:
  ```js
  {error: "No such item"}
  ```
