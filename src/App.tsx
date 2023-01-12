import cn from 'classnames';
import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import productsFromServer from './api/products';
import categoriesFromServer from './api/categories';

import { User } from './types/User';
import { Category } from './types/Category';
import { Product } from './types/Product';

function findUserById(userId: number): User | null {
  return usersFromServer.find(user => user.id === userId) || null;
}

const preparedCategories: Category[] = categoriesFromServer.map(category => (
  {
    ...category,
    user: findUserById(category.ownerId),
  }
));

function findCategoryById(categoryId: number): Category | null {
  return preparedCategories.find(category => (
    category.id === categoryId
  )) || null;
}

const preparedProducts: Product[] = productsFromServer.map(product => (
  {
    ...product,
    category: findCategoryById(product.categoryId),
  }
));

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [products, setProducts] = useState(preparedProducts);
  const [query, setQuery] = useState('');
  const [currentCategory,
    setCurrentCategory,
  ] = useState<number[] >([]);

  const handleUserFilter = (user: User) => {
    const filteredProducts = preparedProducts.filter(product => (
      product.category?.user?.id === user.id
    ));

    setCurrentUser(user);
    setProducts(filteredProducts);
  };

  const handleQueryFilter = (search : string) => {
    const filteredProducts = preparedProducts.filter(product => (
      (product.name).toLowerCase().includes(search.toLowerCase())
      || (product.category?.title)?.toLowerCase().includes(search.toLowerCase())
      || (product.category?.user?.name)?.toLowerCase()
        .includes(search.toLowerCase())
    ));

    return filteredProducts;
  };

  // const handleCategory = (event) => {
  //
  // };

  const showAll = () => {
    setCurrentUser(null);
    setProducts(preparedProducts);
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={cn({
                  'is-active': currentUser === null,
                })}
                onClick={showAll}
              >
                All
              </a>

              {usersFromServer.map((user) => {
                return (
                  <a
                    key={user.id}
                    data-cy="FilterUser"
                    href="#/"
                    className={cn({
                      'is-active': currentUser?.id === user.id,
                    })}
                    onClick={() => handleUserFilter(user)}
                  >
                    {user.name}
                  </a>
                );
              })}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={(event) => {
                    setProducts(handleQueryFilter(event.target.value));
                    setQuery(event.target.value);
                  }}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {
                  query && (
                    <span className="icon is-right">
                      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                      <button
                        data-cy="ClearButton"
                        type="button"
                        className="delete"
                        onClick={() => {
                          setQuery('');
                          setProducts(preparedProducts);
                        }}
                      />
                    </span>
                  )
                }
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              {categoriesFromServer.map((category) => {
                return (
                  <a
                    key={category.id}
                    data-cy="Category"
                    className={cn(
                      'button mr-2 my-1',
                      {
                        'is-info': currentCategory.includes(category.id),
                      },
                    )}
                    href="#/"
                    onClick={() => {
                      if (currentCategory.includes(category.id)) {
                        setCurrentCategory((prev) => {
                          return [...prev.filter((id) => id !== category.id)];
                        });
                      }

                      if (!currentCategory.includes(category.id)) {
                        setCurrentCategory((prev) => {
                          return [...prev, category.id];
                        });
                      }
                    }}
                  >
                    {category.title}
                  </a>
                );
              })}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                onClick={() => {
                  setCurrentCategory([]);
                }}
                className={cn(
                  'button is-link is-fullwidth',
                  {
                    'is-outlined': !currentCategory.length,
                  },
                )}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          <p data-cy="NoMatchingMessage">
            No products matching selected criteria
          </p>

          <table
            data-cy="ProductTable"
            className="table is-striped is-narrow is-fullwidth"
          >
            <thead>
              <tr>
                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    ID

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Product

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-down" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Category

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-up" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    User

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>
              {products.map(product => (
                <tr data-cy="Product" key={product.id}>
                  <td className="has-text-weight-bold" data-cy="ProductId">
                    {product.id}
                  </td>

                  <td data-cy="ProductName">{product.name}</td>
                  <td data-cy="ProductCategory">{`${product.category?.icon} - ${product.category?.title}`}</td>

                  <td
                    data-cy="ProductUser"
                    className={cn(
                      {
                        'has-text-link': product.category?.user?.sex === 'm',
                        'has-text-danger': product.category?.user?.sex === 'f',
                      },
                    )}
                  >
                    {product.category?.user?.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
