import { createContext } from "react";
import config from '../globals/config.json';

class Filters {
    order: 'name' | 'diameter';
    ascending: boolean;
    page: number;
    pageSize: number;
    query: string;
    asteroidClasses: string[];

    constructor(args: any) {
        this.order = args.order;
        this.ascending = args.ascending;
        this.page = args.page;
        this.pageSize = args.pageSize;
        this.query = args.query;
        this.asteroidClasses = args.asteroidClasses;
    }

    static classesToFilter(classDef: typeof config.filters.asteroidClasses[0]): string {
        const params = classDef.params.map((param) => `${param.field}.${param.operator}.${param.value}`)
        const filter = params.length > 1 ? `and(${params.join(', ')})` : params[0]
        return filter
    }
}

interface FiltersContextType {
    filters: Filters;
    setFilters: (filters: Filters) => void;
}

const FiltersContext = createContext<FiltersContextType>({
    filters: config.filters.default as unknown as Filters,
    setFilters: () => {},
})

export default FiltersContext;
export { Filters, type FiltersContextType };
