'use client'

import { type FiltersContextType, FocusContext, TrajectoriesContext, type TrajectoriesContextType, Filters, FiltersContext, TimeControlsContext, type TimeControlsState } from './contexts'
import { useEffect, useState } from 'react'
import config from './globals/config.json'
import { useInterval } from '../../hooks'
import { MultipleContextProvider } from './OrreryUtils'
import { Loading, Scene, SideMenu, TimeControls, Map } from './components'
import ForceLandscape from './components/ForceLandscape'
import { TrajectoryUtils } from './OrreryTypes'
import { nasaApi } from './globals/instances'


export const Orrery = () => {
    const [trajectories, setTrajectories] = useState<TrajectoriesContextType>({
        planets: [],
        smallBodies: [],
    })
    const [timeControls, setTimeControls] = useState<TimeControlsState>(config.timeControls.default)
    const [filters, setFilters] = useState<FiltersContextType>({
        filters: config.filters.default as unknown as Filters,
        setFilters: (_filters: FiltersContextType['filters']) => {
            setFilters({ ...filters, filters: _filters })
        }
    })
    const [selected, setSelected] = useState<string | null>(config.focus.default.selected.objectId)
    const [hovered, setHovered] = useState<string | null>(config.focus.default.hovered.objectId)
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        if (trajectories.planets.length === 0) {
            TrajectoryUtils.load("/sac25/data/planets.json").then(planets => {
                setTrajectories({
                    ...trajectories,
                    planets
                })
            })
            return
        }
        return () => { }
    }, [])

    useEffect(() => {
        if (trajectories.planets.length > 0) {
            setLoading(true)
            nasaApi.getSmallBodies(/*filters.filters*/).then(smallBodies => {
                setTrajectories({
                    ...trajectories,
                    smallBodies: [...smallBodies]
                })
                setLoading(false)
            })
        } else {
            setFilters({...filters})
        }
    }, [filters])

    useInterval(() => {
        if (timeControls.live) {
            const now = new Date().getTime()
            setTimeControls({
                ...timeControls,
                time: now
            })
        } else {
            setTimeControls({
                ...timeControls,
                time: timeControls.time + (timeControls.deltaTime * config.camera.tick)
            })
        }
    }, config.camera.tick)

    return (<>
        <MultipleContextProvider contexts={[
            { context: FiltersContext, value: filters },
            {
                context: TrajectoriesContext,
                value: trajectories
            },
            {
                context: TimeControlsContext,
                value: { timeControls, setTimeControls }
            },
            { context: FocusContext, value: {
                selected: {
                    objectId: selected,
                    setObjectId: setSelected
                },
                hovered: {
                    objectId: hovered,
                    setObjectId: setHovered
                },
                center: [0, 0, 0]
            },},
        ]}>
            <ForceLandscape>
                <Scene />
                <SideMenu />
                <TimeControls />
                <Map />
                <Loading show={loading} fullScreen/>
            </ForceLandscape>
        </MultipleContextProvider>
    </>)
}

