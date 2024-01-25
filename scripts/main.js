import { card } from "../components/card.js";
import { tableRow } from "../components/table.js";
import { referenceList } from "../data/reference.js";
import { renderToDom } from "../utils/renderToDom.js";

// Reusable function to get the cards on the DOM
// .forEach()
const renderCards = (array) => {
  let refStuff = "";
  // This loops through each object in in the referenceList array and adds the values to the card function which then outputs the values from the obj in the card
  array.forEach((obj) => {
    refStuff +=  card(obj)
  })
  renderToDom("#cards", refStuff);
}

// UPDATE/ADD ITEMS TO CART
// .findIndex() & (.includes() - string method)
const toggleCart = (event) => {
  if (event.target.id.includes("fav-btn")) {
  //  console.log('Clicked Fav btn')
  const [, id] = event.target.id.split("--")

  //finding the index of the id in the referenceList and comparing it with or make sure it is equal to the id collected from the button that has the id within it or the event id that was targetted.
  const index =  referenceList.findIndex((item) => item.id === Number(id))
  
  
  //This displays the value for inCart based on the index of the card clicked with the basket. With the bang, it give the opposite of what inCart value is.
  //console.log(referenceList[index].inCart)

  //This means if the referenceList inCart true equal not the 
  referenceList[index].inCart = !referenceList[index].inCart

  cartTotal();

  renderCards(referenceList)
  }
}

// SEARCH
// .filter()
const search = (event) => {
  const userInput = event.target.value.toLowerCase();
  //this is filtering through the referenceList for title, author, and description all in lowercase and see if it includes the value of what is being entered (or whatever the user input is)
  const searchResult = referenceList.filter(item => 
    //if the title includes whatever the userInput is (userInput)
    item.title.toLowerCase().includes(userInput) ||
    item.author.toLowerCase().includes(userInput) ||
    item.description.toLowerCase(userInput)
  )
  // console.log(userInput)
  renderCards(searchResult);
}

// BUTTON FILTER
// .filter() & .reduce() &.sort() - chaining
const buttonFilter = (event) => {
  if(event.target.id.includes('free')) {
    // console.log('FREE')
    //We created a variale that stores an iteration using filter that loops through each item price in the referenceList that is less tjhan or equal to zero. Then we render the variable to show the cars that have price less than or equal to zero when Free is clicked.
    const free = referenceList.filter((item) => item.price <= 0);
    renderCards(free)
  }
  if(event.target.id.includes('cartFilter')) {
    // console.log('cartFilter')
    const wishList = referenceList.filter((item) => item.inCart /*=== true*/);
    renderCards(wishList);
  }
  if(event.target.id.includes('books')) {
    // console.log('books!')
    const bookItem = referenceList.filter((item) => item.type.toLowerCase() === 'book');
    renderCards(bookItem);
  }
  if(event.target.id.includes('clearFilter')) {
    // console.log('clearFilter')
    renderCards(referenceList);
  }
  if(event.target.id.includes('productList')) {
    let table = `<table class="table table-dark table-striped" style="width: 600px">
    <thead>
      <tr>
        <th scope="col">Title</th>
        <th scope="col">Type</th>
        <th scope="col">Price</th>
      </tr>
    </thead>
    <tbody>
    `;
    
    productList().sort((a,b) => a.type.localeCompare(b.type)).forEach(item => {
      table += tableRow(item);
    });

    table += `</tbody></table>`

    renderToDom('#cards', table);
  }
  
}

// CALCULATE CART TOTAL
// .reduce() & .some()
const cartTotal = () => {
  //This will give me all the items in the cart
  const cart = referenceList.filter(item => item.inCart)
  //requires two values, 0 is the initial value and will be a and we need to tell it what to add up to which is the price. a is the constant initial value
  const total = cart.reduce((a, b) => a + b.price, 0);
  const free = cart.some(item => item.price <= 0)
  document.querySelector("#cartTotal").innerHTML = total.toFixed(2);

  if (free) {
    document.querySelector("#includes-free").innerHTML = "INCLUDES FREE ITEMS"
  } else {
    document.querySelector("#includes-free").innerHTML = ''
  }
}

// RESHAPE DATA TO RENDER TO DOM
// .map()

const productList = () => {
  // return [{ title: "SAMPLE TITLE", price: 45.00, type: "SAMPLE TYPE" }]
  //Look for referenceList and map over all items of Reference List and return a new array of objects that I determined what the key/value are. 
  return referenceList.map(item => ({
    title: item.title,
    price: item.price,
    type: item.type
  }))
}


const startApp = () => {
  // PUT ALL CARDS ON THE DOM
  renderCards(referenceList)

  // PUT CART TOTAL ON DOM
  cartTotal();

  // SELECT THE CARD DIV
  document.querySelector('#cards').addEventListener('click', toggleCart);

  // SELECT THE SEARCH INPUT
  //Select on the DOM, an ID, and I want to capture an event of when the release a key, it runs the search function
  document.querySelector('#searchInput').addEventListener('keyup', search)

  // SELECT BUTTON ROW DIV
  document.querySelector('#btnRow').addEventListener('click', buttonFilter);
}
startApp();
