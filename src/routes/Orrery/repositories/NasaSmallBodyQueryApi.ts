import { Trajectory, TrajectoryType } from '../OrreryTypes'
import { type FiltersContextType } from '../contexts';


class SmallBody {
    spkid: string;
    name: string;
    full_name: string;
    e: string;       // oE
    w: string;       // aP
    a: string;       // smA
    ma: string;      // mAe
    i: string;       // oI
    om: string;      // aN
    per_y: string;   // sidereal
    diameter: string;
    rot_per: string;
    sourceJSON: string;
    model: string;
    class : string;
    constructor(args: any[]) {
        args = args.slice(2)
        this.spkid = args[0];
        this.name = args[1];
        this.full_name = args[2];
        this.e = args[5];
        this.w = args[6];
        this.a = args[7];
        this.ma = args[8];
        this.i = args[9];
        this.om = args[10];
        this.per_y = args[11];
        this.diameter = args[12];
        this.rot_per = args[13];
        this.model = args[14];
        this.class = args[15];
        this.sourceJSON = JSON.stringify(args[16])
    }

    static fromObject(obj: any): SmallBody {
        return new SmallBody([
            null, null,
            obj.spkid, obj.name, obj.full_name, obj.neo, obj.pha,
            obj.e, obj.w, obj.a, obj.ma, obj.i, obj.om,
            obj.per_y, obj.diameter, obj.rot_per, obj.model, obj.class, obj
        ])
    }

    toTrajectory(): Trajectory {
        let _type = TrajectoryType.PHA
        return new Trajectory(
            this.spkid,
            this.full_name.toString().trim(),
            parseFloat(this.a),
            parseFloat(this.i),
            parseFloat(this.w),
            parseFloat(this.e),
            parseFloat(this.om),
            parseFloat(this.ma),
            parseFloat(this.per_y),
            parseFloat(this.diameter),
            0,
            parseFloat(this.rot_per),
            _type,
            'grey',
            false,
            this.sourceJSON,
            '',
            this.model
        )
    }
}

class NasaSmallBodyQueryApi {
    private allBodies: SmallBody[] = [];
    private isDataLoaded: boolean = false;

    constructor() {}

    // Load all data from the JSON file
    private async loadAllData(): Promise<SmallBody[]> {
        if (this.isDataLoaded) {
            return this.allBodies;
        }

        try {
            const response = await fetch('/sac25/data/first_values.json');
            const data = await response.json();
            
            const columns = data.fields;
            const rows = data.data;
            
            const result = rows.map((row: any) =>
                row.reduce(
                    (result: any, field: any, index: number) => ({ ...result, [columns[index]]: field }),
                    {}
                )
            );
            
            this.allBodies = result.map((body: any) => SmallBody.fromObject({...body, model: null}));
            this.isDataLoaded = true;
            return this.allBodies;
        } catch (error) {
            console.error('Failed to load small bodies data:', error);
            throw error;
        }
    }

    // Apply all filters to the data
    private applyFilters(bodies: SmallBody[], filters: FiltersContextType['filters']): SmallBody[] {
        let filtered = [...bodies];

        // Text search filter
        if (filters.query && filters.query !== '') {
            const query = filters.query.toLowerCase();
            filtered = filtered.filter(body => 
                body.name?.toLowerCase().includes(query) ||
                body.full_name?.toLowerCase().includes(query)
            );
        }

        // Asteroid classes filter
        if (filters.asteroidClasses.length > 0) {
            filtered = filtered.filter(body => filters.asteroidClasses.includes(body.class));
        }

        return filtered;
    }

    // Sort bodies
    private sortBodies(bodies: SmallBody[], order: string, ascending: boolean): SmallBody[] {
        return bodies.sort((a, b) => {
            let aValue: any = a[order as keyof SmallBody];
            let bValue: any = b[order as keyof SmallBody];

            // Handle numeric fields
            if (['a', 'e', 'i', 'w', 'om', 'ma', 'per_y', 'diameter', 'rot_per'].includes(order)) {
                aValue = aValue ? parseFloat(aValue) : 0;
                bValue = bValue ? parseFloat(bValue) : 0;
            }

            // Handle null/undefined values
            if (aValue == null) return ascending ? 1 : -1;
            if (bValue == null) return ascending ? -1 : 1;

            // Compare values
            if (aValue < bValue) return ascending ? -1 : 1;
            if (aValue > bValue) return ascending ? 1 : -1;
            return 0;
        });
    }

    // Apply pagination
    private paginateBodies(bodies: SmallBody[], page: number, pageSize: number): SmallBody[] {
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return bodies.slice(startIndex, endIndex);
    }

    async getSmallBodies(filters: FiltersContextType['filters'], attempt: number = 0): Promise<Trajectory[]> {
        try {
            // Load all data
            const allBodies = await this.loadAllData();
            
            // Apply filters
            let filteredBodies = this.applyFilters(allBodies, filters);
            
            // Apply sorting
            filteredBodies = this.sortBodies(
                filteredBodies, 
                filters.order || 'name', 
                filters.ascending !== false
            );
            
            // Apply pagination
            const page = filters.page || 1;
            const pageSize = filters.pageSize || 50;
            const paginatedBodies = this.paginateBodies(filteredBodies, page, pageSize);
            
            // Convert to trajectories
            return paginatedBodies.map(body => body.toTrajectory());
            
        } catch (error) {
            console.error('Error in getSmallBodies:', error);
            if (attempt < 5) {
                // Reset cache and retry
                this.isDataLoaded = false;
                this.allBodies = [];
                return await this.getSmallBodies(filters, attempt + 1);
            }
            return [];
        }
    }

    async getFirstValues(): Promise<Trajectory[]> {
        // Just return the first page of unfiltered data
        const bodies = await this.loadAllData();
        const paginatedBodies = this.paginateBodies(bodies, 1, 50);
        return paginatedBodies.map(body => body.toTrajectory());
    }

    // Optional: Method to get total count for pagination
    async getFilteredCount(filters: FiltersContextType['filters']): Promise<number> {
        try {
            const allBodies = await this.loadAllData();
            const filteredBodies = this.applyFilters(allBodies, filters);
            return filteredBodies.length;
        } catch (error) {
            console.error('Error getting filtered count:', error);
            return 0;
        }
    }
}

export default NasaSmallBodyQueryApi;
