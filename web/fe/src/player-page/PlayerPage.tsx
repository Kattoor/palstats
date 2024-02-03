import {Tooltip} from "primereact/tooltip";
import PalCardsContainer from "./pal-card/PalCardsContainer.tsx";
import {usePlayerGuildContext} from "../custom-contexts/player-guild-context/usePlayerGuildContext.ts";
import {useParams} from "react-router-dom";
import {Toolbar} from "primereact/toolbar";
import {usePalFilterContext} from "../custom-contexts/pal-filter-context/usePalFilterContext.ts";
import {PalCardDataMove, usePalCardDataFormatter} from "../custom-hooks/usePalCardDataFormatter.ts";
import {useEffect} from "react";
import {TreeSelect} from "primereact/treeselect";
import {TreeCheckboxSelectionKeys} from "primereact/tree";

function PlayerPage() {
    const {players, pals} = usePlayerGuildContext();
    const {
        moveFilterTree,
        setMoveFilterTree,
        selectedMoveNodeKeys,
        setSelectedMoveNodeKeys
    } = usePalFilterContext();
    const {id} = useParams();

    const player = players.find((player) => player.id === id);

    const playerName = player?.name;
    const playerPals = pals
        .filter((pal) => pal.ownerId === id)
        .map(usePalCardDataFormatter);

    useEffect(() => {
        const movesGroupedByType = playerPals
            .flatMap((pal) => pal.moves)
            .reduce((acc, curr) => {
                if (!acc[curr.type]) {
                    acc[curr.type] = [];
                }

                if (!acc[curr.type].some(({name}) => name === curr.name)) {
                    acc[curr.type].push(curr);
                }

                return acc;
            }, {} as Record<string, PalCardDataMove[]>);

        const tree = Object.entries(movesGroupedByType).map(([type, moves]) => ({
            key: type,
            label: type,
            data: type,
            icon: 'pi pi-fw pi-inbox',
            children: moves.map((move) => ({
                key: type + '.' + move.name,
                label: move.name,
                data: move.name,
                icon: 'pi pi-fw pi-cog'
            }))
        }));

        setMoveFilterTree(tree);
        setSelectedMoveNodeKeys(
            Object.entries(tree)
                .map(([, value]) => value.key)
                .reduce((acc, curr) => Object.assign(acc, {
                    [curr]: {
                        checked: true,
                        partialChecked: false,
                    }
                }), {} as TreeCheckboxSelectionKeys));
    }, []);

    return (
        <div className="w-full">
            <Tooltip target=".tooltip"/>
            <div className="pb-16 text-4xl">Player: {playerName} ({playerPals.length} pals)</div>
            <Toolbar className="mb-8" start={
                <span className="p-float-label w-full min-w-40">
                    <TreeSelect
                        inputId="move-selector"
                        value={selectedMoveNodeKeys}
                        onChange={(e) => setSelectedMoveNodeKeys(e.value as TreeCheckboxSelectionKeys)}
                        options={moveFilterTree}
                        metaKeySelection={false}
                        className="md:w-20rem w-full"
                        selectionMode="checkbox"
                        showClear
                    ></TreeSelect>
                    <label htmlFor="move-selector">Select move</label>
                </span>
            }/>
            <PalCardsContainer pals={playerPals}/>
        </div>
    )
}

export default PlayerPage;
