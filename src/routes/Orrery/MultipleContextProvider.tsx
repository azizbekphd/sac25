import React, { memo, type ReactNode, useMemo } from "react"

export type ContextValuePair<T> = { context: React.Context<T>, value: T };
type MultipleContextProviderProps = {
    contexts: ContextValuePair<any>[],
    children: ReactNode
};

const MultipleContextProvider = memo(function MultipleContextProvider({ contexts, children }: MultipleContextProviderProps) {
    const providers = useMemo(() => {
        return contexts.reduce<(children: ReactNode) => ReactNode>((acc, entry) => {
            return (children: ReactNode) => (
                <entry.context.Provider value={entry.value}>
                    {acc(children)}
                </entry.context.Provider>
            );
        }, (children) => <>{children}</>);
    }, [contexts]);

    return <>{providers(children)}</>;
});

export default MultipleContextProvider;
