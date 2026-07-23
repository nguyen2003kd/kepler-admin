/* eslint-disable */
import type { FiltersParameter } from './filtersParameter';
import type { SortFieldParameter } from './sortFieldParameter';
import type { SortOrderParameter } from './sortOrderParameter';
import type { PageParameter } from './pageParameter';
import type { PageSizeParameter } from './pageSizeParameter';

export type GetApiV10ContactParams = {
/**
 * filter, visit https://www.npmjs.com/package/sequelize-api-paginate for syntax
 */
filters?: FiltersParameter;
/**
 * sortField, visit https://www.npmjs.com/package/sequelize-api-paginate for syntax
 */
sortField?: SortFieldParameter;
/**
 * sort order, visit https://www.npmjs.com/package/sequelize-api-paginate for syntax
 */
sortOrder?: SortOrderParameter;
/**
 * page, visit https://www.npmjs.com/package/sequelize-api-paginate for syntax
 * @minimum 1
 */
page?: PageParameter;
/**
 * pageSize, visit https://www.npmjs.com/package/sequelize-api-paginate for syntax
 * @minimum 1
 */
pageSize?: PageSizeParameter;
};
