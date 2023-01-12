import cn from 'classnames';
import productsFromServer from '../../api/products';
import usersFromServer from '../../api/users';
import categoriesFromServer from '../../api/categories';

export function Product() {
  const findUserById = (ownerId: number | undefined) => {
    return usersFromServer
      .find((user) => user.id === ownerId);
  };

  const findCategoryById = (categoryId: number | undefined) => {
    return categoriesFromServer
      .find((category) => category.id === categoryId);
  };

  return (
    <tbody>
      {productsFromServer.map((product) => {
        return (
          <tr data-cy="Product" key={product.id}>
            <td className="has-text-weight-bold" data-cy="ProductId">
              {product.id}
            </td>

            <td data-cy="ProductName">
              {product.name}
            </td>
            <td data-cy="ProductCategory">
              {`${findCategoryById(product.categoryId)?.icon} - ${findCategoryById(product.categoryId)?.title}`}
            </td>

            <td
              data-cy="ProductUser"
              className={cn({
                'has-text-link': findUserById(
                  findCategoryById(product.categoryId)?.ownerId,
                )?.sex === 'm',
                'has-text-danger': findUserById(
                  findCategoryById(product.categoryId)?.ownerId,
                )?.sex === 'f',
              })}
            >
              {findUserById(
                findCategoryById(product.categoryId)?.ownerId,
              )?.name}
            </td>
          </tr>
        );
      })}
    </tbody>
  );
}
