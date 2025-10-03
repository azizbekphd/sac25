import { useContext, memo, useState, useEffect } from 'react';
import { Filters, FiltersContext } from '../../contexts';
import { useDebounce } from '../../../../hooks';
import MenuSection from '../MenuSection';
import './index.css'
import config from '../../globals/config.json'

const FiltersMenu: React.FC = memo(() => {
    const {filters, setFilters} = useContext(FiltersContext)
    const [query, setQuery] = useState<string>(filters.query)
    const debouncedQuery = useDebounce<string>(query, 500)

    useEffect(() => {
        setFilters({...filters, query: debouncedQuery})
    }, [debouncedQuery])

    return (
        <div className="filters">
            {/* searchbar */}
            <input
                type="search"
                placeholder="Search..."
                className="row"
                value={query}
                onChange={(e) => setQuery(e.target.value)} />
            {/* selects */}
            
            <MenuSection title={`Asteroid class${filters.asteroidClasses.length > 0 ? ' *' : ''}`}>
                {/* checkboxes */}
                {config.filters.asteroidClasses.map((classDef, i) => {
                    const filter = Filters.classesToFilter(classDef, 'asteroids')
                    return (
                        <div key={i} className="row">
                            <input
                                id={classDef.value}
                                type="checkbox"
                                checked={filters.asteroidClasses.includes(filter)}
                                onChange={(e) => {
                                    const ac = [...filters.asteroidClasses]
                                    if (e.target.checked) {
                                        !ac.includes(filter) && ac.push(filter)
                                    } else {
                                        ac.includes(filter) && ac.splice(ac.indexOf(filter), 1)
                                    }
                                    setFilters({
                                        ...filters,
                                        page: 1,
                                        asteroidClasses: ac
                                    })
                                }}
                            />
                            <label
                                className="tooltip-label"
                                title={classDef.description}
                                htmlFor={classDef.value}>{classDef.label}</label>
                        </div>
                    )
                })}
            </MenuSection>
        </div>
    )
})

export default FiltersMenu;
