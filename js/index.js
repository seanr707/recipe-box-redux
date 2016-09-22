'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/* For use with NodeJS
import React from 'react';
import { render } from 'react-dom';
import { List, Map } from 'immutable';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
*/

// Use in browser/codepen
var _React = React;
var PropTypes = _React.PropTypes;
var _ReactDOM = ReactDOM;
var render = _ReactDOM.render;
var _Immutable = Immutable;
var List = _Immutable.List;
var Map = _Immutable.Map;
var _Redux = Redux;
var createStore = _Redux.createStore;
var _ReactRedux = ReactRedux;
var Provider = _ReactRedux.Provider;
var connect = _ReactRedux.connect;

// Dummy recipes
// Cannot use 0 or it will not allow editing

var dummyrecipes = [{
  id: 1,
  title: 'Biscuits',
  ingredients: List(['2 cu. Flour', '1 cups. Butterilk', '2 tsp. Salt', '1/2 stick. Butter']),
  pictureUrl: 'http://dining.savannahnow.com/sites/dining.savannahnow.com/files/styles/flexslider_enhanced/public/field/photos/14729925.jpg'
}, {
  id: 2,
  title: 'Spicey, Cheesey Omelette',
  ingredients: List(['2 Eggs', '1/2 cu. Milk', '1 tsp. Salt', '3 oz. Cheese', '2 oz. Pepperjack Cheese']),
  pictureUrl: 'http://media2.intoday.in/indiatoday/images/stories/story-2om-ladya2172_647_051316100759.jpg'
}, {
  id: 3,
  title: 'Yummy Salad!',
  ingredients: List(['2 cups. Spinach', '1/2 cu. Kale', '3 Boiled Eggs', '1/2 tsp. Salt']),
  pictureUrl: 'http://i447.photobucket.com/albums/qq193/abbyhopson/salad2jpg_zps48633e2a.jpg'
}];

// Actions
var actions = {
  ADD_RECIPE: 'ADD_RECIPE',
  EDIT_RECIPE: 'EDIT_RECIPE',
  DELETE_RECIPE: 'DELETE_RECIPE',
  TOGGLE_EDIT: 'TOGGLE_EDIT',
  TOGGLE_RECIPE: 'TOGGLE_RECIPE',
  ADD_IS_VISIBLE: 'ADD_IS_VISIBLE',
  TOGGLE_ABOUT: 'TOGGLE_ABOUT',
  CLEAR_STATE: 'CLEAR_STATE',
  CHANGE_ABOUT_PAGE: 'CHANGE_ABOUT_PAGE'
};

var getRandom = function getRandom() {
  return Math.floor(Math.random() * (Math.random() * 3.1457) * 100000000);
};

var properCapitalizeString = function properCapitalizeString(aString) {
  return aString.split(' ').map(function (word) {
    return word.substr(0, 1).toUpperCase() + word.substr(1);
  }).join(' ');
};

var checkPicture = function checkPicture(url) {
  if (url) {
    return url;
  } else {
    return 'https://www.polyvore.com/cgi/img-thing?.out=jpg&size=l&tid=124485997';
  }
};

var addValueToKey = function addValueToKey(object, key, value) {
  var temp = {};
  temp[key] = value;
  return Object.assign({}, object, temp);
};

var getLocalStore = function getLocalStore(local) {
  return JSON.parse(local.getItem('_43259x90q-recipeState'));
};

var storeLocalAndReturn = function storeLocalAndReturn(state) {
  window.localStorage.setItem('_432459x90q-recipeState', JSON.stringify(state.toObject()));
  return state;
};

function addRecipe(title, ingredients, pictureUrl) {
  return {
    type: actions.ADD_RECIPE,
    id: getRandom(),
    title: properCapitalizeString(title),
    // Splits where any commas or semicolons are placed (even if space after)
    ingredients: List(ingredients.split(/\s?[,|;]+\s?/gi).map(properCapitalizeString)),
    pictureUrl: checkPicture(pictureUrl)
  };
}

function editRecipe(id, title, ingredients, pictureUrl) {
  return {
    type: actions.EDIT_RECIPE,
    id: id,
    title: title,
    ingredients: List(ingredients.split(/\s?[,|;]+\s?/gi)),
    pictureUrl: checkPicture(pictureUrl)
  };
}

function deleteRecipe(id) {
  return {
    type: actions.DELETE_RECIPE,
    id: id
  };
}

function toggleEdit(id) {
  return {
    type: actions.TOGGLE_EDIT,
    id: id
  };
}

function toggleRecipe(id) {
  return {
    type: actions.TOGGLE_RECIPE,
    id: id
  };
}

function toggleAddEditPopup(bool) {
  return {
    type: actions.ADD_IS_VISIBLE,
    bool: bool
  };
}

function toggleAbout() {
  return {
    type: actions.TOGGLE_ABOUT
  };
}

function _clearState() {
  return {
    type: actions.CLEAR_STATE
  };
}

function changeAboutPage(pageNumber) {
  return {
    type: actions.CHANGE_ABOUT_PAGE,
    pageNumber: pageNumber
  };
}

// Reducers
var initialState = undefined;

var defaultState = Map({
  recipes: List(dummyrecipes),
  toggles: {
    addEditIsHidden: true,
    currentlyEditing: null,
    aboutVisible: false
  },
  viewingRecipeId: 0,
  currentAboutPage: 0
});

if (getLocalStore(window.localStorage)) {
  initialState = getLocalStore(window.localStorage);
  // Turn objects/arrays back into immutables
  initialState.recipes = List(initialState.recipes.map(function (recipe) {
    recipe.ingredients = List(recipe.ingredients);
    return recipe;
  }));
  initialState = Map(initialState);
} else {
  initialState = defaultState;
}

function recipeApp() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
  var action = arguments[1];

  var property = '';
  switch (action.type) {
    case actions.ADD_RECIPE:
      property = 'recipes';
      return storeLocalAndReturn(state.set(property, state.get(property).push({
        id: action.id,
        title: action.title,
        ingredients: action.ingredients,
        pictureUrl: action.pictureUrl
      })));

    case actions.TOGGLE_EDIT:
      property = 'toggles';
      return storeLocalAndReturn(state.set(property, addValueToKey(state.get(property), 'currentlyEditing', action.id)));

    case actions.EDIT_RECIPE:
      property = 'recipes';
      return storeLocalAndReturn(state.set(property, state.get(property).map(function (recipe) {
        if (recipe.id === action.id) {
          recipe.title = action.title;
          recipe.ingredients = action.ingredients;
          recipe.pictureUrl = action.pictureUrl;
        }

        return recipe;
      })));

    case actions.DELETE_RECIPE:
      property = 'recipes';
      return storeLocalAndReturn(state.set(property, state.get(property).filter(function (recipe) {
        return recipe.id !== action.id;
      })));

    case actions.ADD_IS_VISIBLE:
      property = 'toggles';
      return storeLocalAndReturn(state.set(property, addValueToKey(state.get(property), 'addEditIsHidden', action.bool)));

    case actions.TOGGLE_RECIPE:
      property = 'toggles';
      return storeLocalAndReturn(state.set(property, addValueToKey(state.get(property), 'viewingRecipeId', state.get('recipes').toJS().filter(function (item) {
        if (item.id === action.id) {
          return true;
        } else {
          return false;
        }
      })[0])));

    case actions.TOGGLE_ABOUT:
      property = 'toggles';
      return storeLocalAndReturn(state.set(property, addValueToKey(state.get(property), 'aboutVisible', !state.get(property)['aboutVisible'])));

    case actions.CLEAR_STATE:
      return storeLocalAndReturn(defaultState);

    case actions.CHANGE_ABOUT_PAGE:
      return storeLocalAndReturn(state.set('currentAboutPage', action.pageNumber));

    default:
      return state;
  }
}

var store = createStore(recipeApp);

// Presentation components
// Background for popups
var Background = function Background(_ref) {
  var toggle = _ref.toggle;

  return React.createElement('div', { className: 'background', onClick: toggle });
};

Background.propTypes = {
  toggle: PropTypes.func.isRequired
};

var RecipePopUp = function RecipePopUp(_ref2) {
  var recipe = _ref2.recipe;
  var onEditClick = _ref2.onEditClick;
  var onDeleteClick = _ref2.onDeleteClick;
  var toggle = _ref2.toggle;

  var ingredientsHtml = undefined;
  var isHidden = 'popup-container';
  var id = undefined;
  var title = undefined;
  var ingredients = undefined;

  // Returns empty div if the element is not needed.
  if (!recipe) {
    ingredientsHtml = React.createElement(
      'tr',
      { key: '0', className: 'ingredient' },
      React.createElement(
        'td',
        { className: 'quantity' },
        '--'
      ),
      React.createElement(
        'td',
        { className: 'measurement' },
        '--'
      ),
      React.createElement(
        'td',
        { className: 'ingredient-name' },
        '------'
      )
    );
    isHidden += ' hidden';
    id = 0;
    title = '';
  } else {
    (function () {
      id = recipe.id;
      title = recipe.title;
      ingredients = recipe.ingredients;

      var keyNum = 0;
      ingredientsHtml = ingredients.map(function (ingredient) {
        // First item is quantity, second is measurement
        var amount = ingredient.match(/(([0-9]+(\s[0-9]+)?\/?[0-9]{0,2})\s?([a-z]+\.)?)/gi);
        var ingredientName = undefined;

        if (amount) {
          // Declared first before amount changes into array
          ingredientName = ingredient.split(amount).join('').trim();
          amount = amount[0].split(/\s(?=[a-z])/gi);
        } else {
          amount = ['--', '--'];
          ingredientName = ingredient;
        }

        return React.createElement(
          'tr',
          { key: keyNum++, className: 'ingredient' },
          React.createElement(
            'td',
            { className: 'quantity' },
            amount[0]
          ),
          React.createElement(
            'td',
            { className: 'measurement' },
            amount[1]
          ),
          React.createElement(
            'td',
            { className: 'ingredient-name' },
            ingredientName
          )
        );
      });
    })();
  }

  return React.createElement(
    'div',
    { className: isHidden },
    React.createElement(Background, { toggle: toggle }),
    React.createElement(
      'div',
      { className: 'expanded recipe-box popup' },
      React.createElement(
        'div',
        { className: 'title' },
        React.createElement(
          'a',
          { href: '#main', onClick: toggle },
          title
        )
      ),
      React.createElement(
        'div',
        { className: 'ingredient-list popup-body-container' },
        React.createElement(
          'table',
          { className: 'ingredients' },
          React.createElement(
            'thead',
            null,
            React.createElement(
              'tr',
              null,
              React.createElement(
                'th',
                { className: 'quantity' },
                'Qty'
              ),
              React.createElement(
                'th',
                { className: 'measurement' },
                'Units'
              ),
              React.createElement(
                'th',
                { className: 'ingredient-name' },
                'Ingredient'
              )
            )
          ),
          React.createElement(
            'tbody',
            null,
            ingredientsHtml
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'ingredients-alter-buttons' },
        React.createElement(
          'button',
          { className: 'btn btn-default', onClick: function onClick() {
              return onEditClick(id);
            } },
          'Edit'
        ),
        React.createElement(
          'button',
          { className: 'btn btn-danger', onClick: function onClick() {
              return onDeleteClick(id);
            } },
          'Delete'
        )
      )
    )
  );
};

RecipePopUp.propTypes = {
  recipe: PropTypes.object,
  onEditClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  toggle: PropTypes.func.isRequired
};

var mapStateToRecipePopUpProps = function mapStateToRecipePopUpProps(state) {
  return {
    'recipe': state.get('toggles')['viewingRecipeId']
  };
};

var mapDispatchToRecipePopUpProps = function mapDispatchToRecipePopUpProps(dispatch) {
  return {
    onEditClick: function onEditClick(id) {
      dispatch(toggleEdit(id));
      dispatch(toggleAddEditPopup(false));
      dispatch(toggleRecipe(null));
    },
    onDeleteClick: function onDeleteClick(id) {
      dispatch(deleteRecipe(id));
      dispatch(toggleRecipe(null));
    },
    toggle: function toggle() {
      dispatch(toggleRecipe(null));
    }
  };
};

RecipePopUp = connect(mapStateToRecipePopUpProps, mapDispatchToRecipePopUpProps)(RecipePopUp);

// Recipe item
var Recipe = function Recipe(_ref3) {
  var onClick = _ref3.onClick;
  var title = _ref3.title;
  var ingredients = _ref3.ingredients;
  var pictureUrl = _ref3.pictureUrl;
  var expanded = _ref3.expanded;

  return React.createElement(
    'div',
    { onClick: onClick, className: 'collapsed recipe-box' },
    React.createElement('img', { src: pictureUrl, alt: 'picOf-' + title.replace(/\s/gi, '+'), className: 'recipe-picture' }),
    React.createElement(
      'div',
      { className: 'title-box' },
      React.createElement(
        'a',
        { href: '#' + title.replace(/\W(?=\w)+/gi, '_').replace(/\W+/gi, '') },
        React.createElement(
          'p',
          { className: 'collapsed-title' },
          title
        )
      )
    )
  );
};

Recipe.propTypes = {
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  ingredients: PropTypes.object.isRequired,
  pictureUrl: PropTypes.string,
  expanded: PropTypes.bool.isRequired
};

// Recipe List
var RecipeList = function RecipeList(_ref4) {
  var recipes = _ref4.recipes;
  var onRecipeClick = _ref4.onRecipeClick;

  var recipeListHtml = recipes.map(function (recipe) {
    return React.createElement(Recipe, _extends({
      key: recipe.id
    }, recipe, {
      onClick: function onClick() {
        return onRecipeClick(recipe.id);
      }
    }));
  });

  return React.createElement(
    'div',
    { className: 'recipelist-wrapper' },
    recipeListHtml
  );
};

RecipeList.propTypes = {
  recipes: PropTypes.object.isRequired,
  onRecipeClick: PropTypes.func.isRequired
};

// Container Components
// Mapping state and dispatch to props
var mapStateToProps = function mapStateToProps(state) {
  return {
    recipes: state.get('recipes')
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    onRecipeClick: function onRecipeClick(id) {
      dispatch(toggleRecipe(id));
    }
  };
};

var RenderRecipeList = connect(mapStateToProps, mapDispatchToProps)(RecipeList);

var FormTemplate = function FormTemplate(_ref5) {
  var recipes = _ref5.recipes;
  var editId = _ref5.editId;
  var toggle = _ref5.toggle;
  var submitRecipe = _ref5.submitRecipe;

  var formName = undefined;
  var title = undefined;
  var ingredients = undefined;
  var pictureUrl = undefined;
  var titleHolder = undefined;
  var ingredientsHolder = undefined;
  var urlHolder = undefined;

  if (editId) {
    formName = 'Edit';

    // Find correct recipe object to edit
    var recipe = recipes.toArray().filter(function (item) {
      return item.id === editId;
    })[0];
    // Fill in input with current values
    titleHolder = { defaultValue: recipe.title };
    ingredientsHolder = { defaultValue: recipe.ingredients.join(', ') };
    urlHolder = { defaultValue: recipe.pictureUrl };
  } else {
    formName = 'Add';

    // Give placeholders for example of what to put
    titleHolder = { placeholder: 'Scrambled Eggs' };
    ingredientsHolder = { placeholder: '2 Eggs, 1 cu. Milk, 1/2 stick. Butter, 1 tsp. Salt' };
    urlHolder = { placeholder: checkPicture() };
  }

  return React.createElement(
    'form',
    { onSubmit: function onSubmit(e) {
        e.preventDefault();
        // If blank in either field then do not submit
        if (!title.value.trim() || !ingredients.value.trim()) {
          return;
        }

        if (!pictureUrl.value.trim()) {
          pictureUrl.value = '';
        }
        // Either add or edit recipe; editId is last since it is not need for addRecipe()
        submitRecipe(title.value, ingredients.value, pictureUrl.value, editId);
        // Return null for editId and/or hide form PopUp
        toggle(editId);
        // Reset fields
        title.value = '';
        ingredients.value = '';
        pictureUrl.value = '';
      } },
    React.createElement(
      'table',
      { className: 'input-table' },
      React.createElement(
        'tbody',
        null,
        React.createElement(
          'tr',
          null,
          React.createElement(
            'td',
            { className: 'input-title' },
            React.createElement(
              'p',
              { className: 'input-p inputTitle' },
              'Recipe Title:'
            )
          ),
          React.createElement(
            'td',
            null,
            React.createElement('input', _extends({}, titleHolder, { type: 'text', ref: function ref(node) {
                title = node;
              } }))
          )
        ),
        React.createElement(
          'tr',
          null,
          React.createElement(
            'td',
            { className: 'input-title' },
            React.createElement(
              'p',
              { className: 'input-p inputIngredients' },
              'Recipe Ingredients:'
            )
          ),
          React.createElement(
            'td',
            null,
            React.createElement('input', _extends({}, ingredientsHolder, { type: 'text', ref: function ref(node) {
                ingredients = node;
              } }))
          )
        ),
        React.createElement(
          'tr',
          null,
          React.createElement(
            'td',
            { className: 'input-title' },
            React.createElement(
              'p',
              { className: 'input-p' },
              'Recipe Picture URL:'
            )
          ),
          React.createElement(
            'td',
            null,
            React.createElement('input', _extends({}, urlHolder, { type: 'url', ref: function ref(node) {
                pictureUrl = node;
              } }))
          )
        )
      )
    ),
    React.createElement(
      'div',
      { className: 'ingredients-alter-buttons' },
      React.createElement(
        'button',
        { className: 'btn btn-primary', type: 'submit' },
        formName
      ),
      React.createElement(
        'button',
        { className: 'btn btn-default', type: 'button', onClick: function onClick() {
            return toggle(editId);
          } },
        'Cancel'
      )
    )
  );
};

FormTemplate.propTypes = {
  recipes: PropTypes.array,
  editId: PropTypes.number,
  toggle: PropTypes.func.isRequired,
  submitRecipe: PropTypes.func
};

var mapStateToPropsEditForm = function mapStateToPropsEditForm(state) {
  return {
    recipes: state.get('recipes'),
    editId: state.get('toggles')['currentlyEditing']
  };
};

var mapDispatchToPropsEditForm = function mapDispatchToPropsEditForm(dispatch) {
  return {
    toggle: function toggle(id) {
      dispatch(toggleEdit(null));
      dispatch(toggleAddEditPopup(true));
      // Re-renders recipe
      dispatch(toggleRecipe(id));
    },
    submitRecipe: function submitRecipe(title, ingredients, pictureUrl, id) {
      dispatch(editRecipe(id, title, ingredients, pictureUrl));
    }
  };
};

var EditForm = connect(mapStateToPropsEditForm, mapDispatchToPropsEditForm)(FormTemplate);

var mapDispatchToPropsAddForm = function mapDispatchToPropsAddForm(dispatch) {
  return {
    toggle: function toggle() {
      dispatch(toggleAddEditPopup(true));
    },
    submitRecipe: function submitRecipe(title, ingredients, pictureUrl) {
      dispatch(addRecipe(title, ingredients, pictureUrl));
    }
  };
};

var AddForm = connect(undefined, mapDispatchToPropsAddForm)(FormTemplate);

var FormPopup = function FormPopup(_ref6) {
  var addEditIsHidden = _ref6.addEditIsHidden;
  var currentlyEditing = _ref6.currentlyEditing;
  var toggle = _ref6.toggle;

  var Form = undefined;
  var title = undefined;
  var isHidden = 'popup-container';

  if (addEditIsHidden) {
    isHidden += ' hidden';
  }

  if (currentlyEditing) {
    title = 'Edit Recipe';
    Form = React.createElement(EditForm, null);
  } else {
    title = 'Add Recipe';
    Form = React.createElement(AddForm, null);
  }

  return React.createElement(
    'div',
    { className: isHidden },
    React.createElement(Background, { toggle: toggle }),
    React.createElement(
      'div',
      { className: 'popup' },
      React.createElement(
        'div',
        { className: 'title' },
        title
      ),
      React.createElement(
        'div',
        { className: 'popup-body-container' },
        Form
      )
    )
  );
};

FormPopup.propTypes = {
  addEditIsHidden: PropTypes.bool.isRequired,
  currentlyEditing: PropTypes.any,
  toggle: PropTypes.func.isRequired
};

var mapStateToPropsFormPopUp = function mapStateToPropsFormPopUp(state) {
  return {
    addEditIsHidden: state.get('toggles')['addEditIsHidden'],
    currentlyEditing: state.get('toggles')['currentlyEditing']
  };
};

var mapDispatchToPropsFormPopUp = function mapDispatchToPropsFormPopUp(dispatch) {
  return {
    toggle: function toggle() {
      dispatch(toggleAddEditPopup(true));
      // Empties out form if background clicked instead of Cancel during EditForm
      dispatch(toggleEdit(null));
    }
  };
};

FormPopup = connect(mapStateToPropsFormPopUp, mapDispatchToPropsFormPopUp)(FormPopup);

var AboutPopup = function AboutPopup(_ref7) {
  var aboutVisible = _ref7.aboutVisible;
  var currentPage = _ref7.currentPage;
  var changePageTo = _ref7.changePageTo;
  var toggle = _ref7.toggle;

  var title = 'About This Page';
  var isHidden = 'popup-container';

  if (!aboutVisible) {
    isHidden += ' hidden';
  }

  var pageOne = function pageOne() {
    var className = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

    return React.createElement(
      'div',
      { className: 'page ' + className },
      React.createElement(
        'p',
        null,
        'This page was designed for a project for FreeCodeCamp.'
      ),
      React.createElement(
        'p',
        null,
        'The requirements for the project were:'
      ),
      React.createElement(
        'ul',
        null,
        React.createElement(
          'li',
          null,
          'Create recipes with names and ingredients'
        ),
        React.createElement(
          'li',
          null,
          'See all recipes where all names are visible'
        ),
        React.createElement(
          'li',
          null,
          'The user can click a recipe to view the ingredients'
        ),
        React.createElement(
          'li',
          null,
          'Recipes can be edited and deleted'
        ),
        React.createElement(
          'li',
          null,
          'Recipes are saved to local storage'
        ),
        React.createElement(
          'li',
          null,
          'Use of React and SASS/SCSS'
        )
      )
    );
  };

  var pageTwo = function pageTwo() {
    var className = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

    return React.createElement(
      'div',
      { className: 'page ' + className },
      React.createElement(
        'p',
        null,
        'In addition to the above requirements, the page should have the following features:'
      ),
      React.createElement(
        'ul',
        null,
        React.createElement(
          'li',
          null,
          'Use of the Redux and React-Redux libraries'
        ),
        React.createElement(
          'li',
          null,
          'Use of immutable data structures with ImmutableJS'
        ),
        React.createElement(
          'li',
          null,
          'Fluid animations of changing elements'
        ),
        React.createElement(
          'li',
          null,
          'The ability to clear the local storage of all new recipes'
        ),
        React.createElement(
          'li',
          null,
          'A fluid, functioning mobile design'
        )
      )
    );
  };

  var pageThree = function pageThree() {
    var className = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

    return React.createElement(
      'div',
      { className: 'page ' + className },
      React.createElement(
        'p',
        null,
        'In addition to the above requirements, the page should have the following features:'
      ),
      React.createElement(
        'ul',
        null,
        React.createElement(
          'li',
          null,
          'The ability to add a picture of the dish (or not)'
        ),
        React.createElement(
          'li',
          null,
          'Text entered should automatically be capitalized'
        ),
        React.createElement(
          'li',
          null,
          'Ingredients entered should be parsed to divide up the quantity, measurement, and ingredient'
        )
      )
    );
  };

  var pageFour = function pageFour() {
    var className = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

    return React.createElement(
      'div',
      { className: 'page ' + className },
      React.createElement(
        'p',
        null,
        'In addition to the above requirements, the page should have the following features:'
      ),
      React.createElement(
        'ul',
        null,
        React.createElement(
          'li',
          null,
          'Tiles should display in a fluid, centered, grid pattern'
        ),
        React.createElement(
          'li',
          null,
          'The user should be able to read about the various features of the site and go through various pages'
        ),
        React.createElement(
          'li',
          null,
          'The user should be able to exit the page and the exact state be returned to on next visit'
        )
      )
    );
  };

  var pageFive = function pageFive() {
    var className = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

    return React.createElement(
      'div',
      { className: 'page ' + className },
      React.createElement(
        'p',
        null,
        'Future, possible addtions:'
      ),
      React.createElement(
        'ul',
        null,
        React.createElement(
          'li',
          null,
          'Drag and drop recipes to change order'
        ),
        React.createElement(
          'li',
          null,
          'OAuth sign-in and saving recipes to a user\'s account'
        ),
        React.createElement(
          'li',
          null,
          'Back-end built and deployed on Heroku'
        )
      )
    );
  };

  var output = [pageOne, pageTwo, pageThree, pageFour, pageFive].map(function (page, i) {
    if (currentPage === i) {
      return page();
    } else if (currentPage > i) {
      return page('no-visible move-right');
    } else if (currentPage < i) {
      return page('no-visible move-left');
    }
  });

  return React.createElement(
    'div',
    { className: isHidden },
    React.createElement(Background, { toggle: toggle }),
    React.createElement(
      'div',
      { className: 'popup' },
      React.createElement(
        'div',
        { className: 'title', onClick: toggle },
        title
      ),
      React.createElement(
        'div',
        { className: 'popup-body-container' },
        React.createElement(
          'div',
          { className: 'inline arrow-container' },
          React.createElement(
            'button',
            { disabled: currentPage - 1 < 0, className: 'arrow left-arrow', onClick: function onClick() {
                return changePageTo(currentPage - 1);
              } },
            '◀'
          )
        ),
        output,
        React.createElement(
          'div',
          { className: 'inline arrow-container' },
          React.createElement(
            'button',
            { disabled: currentPage + 1 >= output.length, className: 'arrow right-arrow', onClick: function onClick() {
                return changePageTo(currentPage + 1);
              } },
            '▶'
          )
        )
      )
    )
  );
};

AboutPopup.propTypes = {
  aboutVisible: PropTypes.bool.isRequired,
  currentPage: PropTypes.number.isRequired,
  changePageTo: PropTypes.func.isRequired,
  toggle: PropTypes.func.isRequired
};

var mapStateToPropsAboutPopup = function mapStateToPropsAboutPopup(state) {
  return {
    aboutVisible: state.get('toggles')['aboutVisible'],
    currentPage: state.get('currentAboutPage')
  };
};

var mapDispatchToPropsAboutPopup = function mapDispatchToPropsAboutPopup(dispatch) {
  return {
    toggle: function toggle() {
      dispatch(toggleAbout());
    },
    changePageTo: function changePageTo(pageNumber) {
      dispatch(changeAboutPage(pageNumber));
    }
  };
};

AboutPopup = connect(mapStateToPropsAboutPopup, mapDispatchToPropsAboutPopup)(AboutPopup);

var AddButton = function AddButton(_ref8) {
  var dispatch = _ref8.dispatch;

  return React.createElement(
    'div',
    { id: 'addButtonContainer' },
    React.createElement(
      'button',
      { id: 'addButton', className: 'btn btn-primary', onClick: function onClick() {
          dispatch(toggleAddEditPopup(false));
        } },
      'Add'
    )
  );
};

AddButton.propTypes = {
  dispatch: PropTypes.func.isRequired
};

AddButton = connect()(AddButton);

// Navbar
var Navbar = function Navbar() {
  return React.createElement(
    'nav',
    { className: 'navbar' },
    React.createElement(
      'div',
      { className: 'nav-container' },
      React.createElement(
        'div',
        { className: 'nav-title' },
        React.createElement(
          'p',
          null,
          'Redux Recipe Box'
        )
      ),
      React.createElement(
        'div',
        { className: 'nav-buttons' },
        React.createElement(About, null),
        React.createElement(Clear, null)
      )
    )
  );
};

Navbar = connect()(Navbar);

// About button
var About = function About(_ref9) {
  var toggle = _ref9.toggle;

  return React.createElement(
    'div',
    { type: 'button', id: 'about-button', className: 'nav-button no-mobile', onClick: toggle },
    'About'
  );
};

About.propTypes = {
  toggle: PropTypes.func.isRequired
};

var mapDispatchToAboutProps = function mapDispatchToAboutProps(dispatch) {
  return {
    toggle: function toggle() {
      dispatch(toggleAbout());
    }
  };
};

About = connect(undefined, mapDispatchToAboutProps)(About);

var Clear = function Clear(_ref10) {
  var clearState = _ref10.clearState;

  return React.createElement(
    'div',
    { id: 'clear-button', className: 'nav-button', onClick: clearState },
    'Clear'
  );
};

Clear.propTypes = {
  clearState: PropTypes.func.isRequired
};

var mapDispatchToClearProps = function mapDispatchToClearProps(dispatch) {
  return {
    clearState: function clearState() {
      var warning = 'Clicking \"OK\" will delete all stored recipes PERMANENTLY, are you sure you want to do this?';
      if (confirm(warning)) {
        dispatch(_clearState());
      }
    }
  };
};

Clear = connect(undefined, mapDispatchToClearProps)(Clear);

// Put together
var App = function App() {
  return React.createElement(
    'div',
    { id: 'root' },
    React.createElement(Navbar, null),
    React.createElement(RenderRecipeList, null),
    React.createElement(AddButton, null),
    React.createElement(AboutPopup, null),
    React.createElement(FormPopup, null),
    React.createElement(RecipePopUp, null)
  );
};

// Render in Provider to create state everywhere
render(React.createElement(
  Provider,
  { store: store },
  React.createElement(App, null)
), document.getElementById('app'));