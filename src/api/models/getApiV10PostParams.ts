/* eslint-disable */
import type { FiltersParameter } from './filtersParameter';
import type { SortFieldParameter } from './sortFieldParameter';
import type { SortOrderParameter } from './sortOrderParameter';
import type { PageParameter } from './pageParameter';
import type { PageSizeParameter } from './pageSizeParameter';
import type { GetApiV10PostPosition } from './getApiV10PostPosition';
import type { GetApiV10PostSortOrderPosition } from './getApiV10PostSortOrderPosition';
import type { GetApiV10PostFilterBy } from './getApiV10PostFilterBy';

export type GetApiV10PostParams = {
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
/**
 * Filter posts by category ID
 */
category_id?: string;
/**
 * Filter posts by page ID
 */
page_id?: string;
/**
 * Set to 'true' to sort posts by position within a category/page
 */
position?: GetApiV10PostPosition;
/**
 * Sort order for position (ASC or DESC)
 */
sortOrderPosition?: GetApiV10PostSortOrderPosition;
/**
 * Filter posts by role (CLIENT or ADMIN)
 */
filterBy?: GetApiV10PostFilterBy;
};
