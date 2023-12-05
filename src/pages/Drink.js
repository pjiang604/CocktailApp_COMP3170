import './Drink.css'
import { Outlet, Link } from "react-router-dom";
import Footer from "../components/Footer";
import { useState, useEffect, useContext } from "react";
import "./Drink.css"
import DrinkHero from '../assets/Hero/DrinkHero.png'
import { useLocation } from "react-router-dom";
import { InventoryContext } from "../data/inventoryContext";
import Product from "../components/Note/Product";
import { filter, sort } from "../utils/helpers";
import Navbar from "../components/Nav";
import { nanoid } from 'nanoid';


const Drink = () => {

  const [editing2, setEditing2] = useState(null)
  const [product2, setProduct2] = useState([])


  const [productInfo, setProductInfo] = useState({
    name: "",
    id: ""
  })

  const { addProduct, setEditing, updateProduct, editing, products } =
    useContext(InventoryContext);

  const [data, setData] = useState();
  const [steps, setSteps] = useState([]);

  const location = useLocation();
  const { drinkId } = location.state || {};


  // const drinkId = location.state.drinkId;
  const API_URL = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkId}`;

  useEffect(() => {
    fetch(API_URL)
      .then(response => response.json()) // converts the data to a JSON file
      .then(response => {
        setData(response); // the data is now stored in the useState
        console.log(data);
        return response.drinks[0].strInstructions;
      })
      .then(recipeStr => {
        const recipeSplit = recipeStr.split('. ');
        setSteps(recipeSplit);
      })
      .catch(err => {
        console.log(err);
      });
      const savedItem = JSON.parse(localStorage.getItem('drink' + drinkId));
      console.log("saved item", savedItem);
    
      if (savedItem !== null) {
        setProduct2(savedItem);
      } else {
        console.log("no data");
      }
      console.log(`${drinkId}`)

  }, []);

  useEffect(() => {
    localStorage.setItem('drink' + drinkId, JSON.stringify(product2))
    console.log('product updated', product2)
  }, [product2])

  function setEditing3(id) {
    // Find the product with the given id
    const productToEdit = product2.find((p) => p.id === id);

    // Set the editing state
    setEditing(id);
    setEditing2("edit")

    // Set the product state for pre-filling the input box
    setProduct({
      name: productToEdit.name,
      time: new Date().toLocaleTimeString(),
      id: productToEdit.id,
    });
  }


  const [product, setProduct] = useState({
    name: '',
    time: new Date().toLocaleTimeString(),
    id: nanoid()
  });


  function handleSubmit(e) {
    e.preventDefault();
    console.log(editing2);
    const existingProductIndex = product2.findIndex((p) => p.id === product.id);
  
    if (editing2 === "new") {
      setProduct2([...product2, { ...product, id: nanoid() }]);
      console.log(product, product2);
    } else if (editing2 === "edit" && existingProductIndex !== -1) {
      const updatedProductList = [...product2];
      updatedProductList[existingProductIndex] = product;
      setProduct2(updatedProductList);
      // Reset editing state after updating
      setEditing2("new");
    }
    console.log("stringify", JSON.stringify(product2))
    console.log("parse", JSON.parse(JSON.stringify(product2)))
  
    setProduct({
      name: "",
      time: new Date().toLocaleTimeString(),
      id: nanoid(), // Only reset ID if needed (e.g., for a new product)
    });
  }
  
  function deleteProduct2(id) {
    // setProducts(products.filter((p) => p.id !== id));
    const updatedProducts = products.filter((product) => product.id !== id);
    setProduct2(updatedProducts);
    console.log(updatedProducts)

  }
  

  function handleInput(e, field) {
    setProduct({ ...product, [field]: e.target.value });
  }



  useEffect(() => {
    console.log("edit updated", editing2)
  }, [editing2])



  //Local state for tracking filter and sorting selections
  const [filterSelection, setFilterSelection] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [inStockFilter, setInStockFilter] = useState(false);

  let displayedProducts = sort(products, sortOrder);
  displayedProducts = filter(displayedProducts, filterSelection, inStockFilter);

  return (
    <>
      <div>
        <div className="drinkDisplay">
          <Navbar />
          {
            data && data.drinks && data.drinks.map((a, value) => {
              return (
                <div key={value} className="drinkContainer">
                  <div className="drinkHeroSection">
                    <img src={DrinkHero} className="drinkHeroImg" alt="hero image" />
                    <h2 className="drinkName">{a.strDrink}</h2>
                  </div>
                  <div className="drinkInfo">
                    <div className="drinkLeft">
                      <img src={a.strDrinkThumb} className="drinkPageImg" alt={a.strDrink} />
                    </div>
                    <div className="drinkRight">
                      <h3>Ingredients</h3>
                      <ul className="ingredientsList">
                        {a.strMeasure1 && <li>{a.strMeasure1} {a.strIngredient1}</li>}
                        {a.strMeasure2 && <li>{a.strMeasure2} {a.strIngredient2}</li>}
                        {a.strMeasure3 && <li>{a.strMeasure3} {a.strIngredient3}</li>}
                        {a.strMeasure4 && <li>{a.strMeasure4} {a.strIngredient4}</li>}
                        {a.strMeasure5 && <li>{a.strMeasure5} {a.strIngredient5}</li>}
                        {a.strMeasure6 && <li>{a.strMeasure6} {a.strIngredient6}</li>}
                      </ul>
                      <h3>Instructions</h3>
                      <ol className="instructions">
                        {steps.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ol>
                      <p>Serve: {a.strGlass}</p>
                    </div>
                  </div>
                </div>
              )
            }
            )
          }
          <div className="notes">
            <h1 className="note_title">Notes</h1>


            {!editing2 ? (
              <>
                <button
                  className="save-btn add-btn"
                  onClick={() => {
                    console.log("Add a Task button clicked");
                    setEditing2("new");
                    console.log("editing2", editing2)
                  }}
                >
                  Add a Note!
                </button>
              </>
            ) : (


              <div className="add-form">
                <form onSubmit={handleSubmit}>
                  <div>
                    <input
                      id="outlined-basic"
                      label="Your Task:"
                      variant="outlined"
                      fullWidth
                      color="success"
                      value={product.name}
                      onChange={(e) => handleInput(e, "name")}
                    />
                  </div>

                  <div className="form-btns">
                    <button
                      className="cancel-btn"
                      color="error"
                      onClick={() => setEditing2(null)}
                    >
                      Cancel
                    </button>
                    <button className="save-btn" color="success" type="submit">
                      Add Task
                    </button>
                  </div>
                  <p value={product.time}>Time Created: {product.time}</p>
                </form>
                <div>
                  <div className="products">
                    {product2 && product2.length > 0 ? (
                      product2.map((p) => (
                        <Product
                          key={p.id}
                          product={p}
                          name={p.name}
                          deleteProduct2={deleteProduct2}
                          setEditing3={setEditing3}
                        />
                      ))
                    ) : (
                      <p>No drink notes...yet!</p>
                    )}
                  </div>

                </div>
              </div>
            )}

          </div>

        </div>
      </div>
      <Outlet />
      <Footer />
    </>
  )
};

export default Drink;

