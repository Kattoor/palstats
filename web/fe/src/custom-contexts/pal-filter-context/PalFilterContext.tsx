import {createContext, FC, PropsWithChildren, useState} from "react";
import {TreeNode} from "primereact/treenode";
import {TreeCheckboxSelectionKeys} from "primereact/tree";

interface PalFilterContextType {
    moveFilterTree: TreeNode[];
    setMoveFilterTree: (tree: TreeNode[]) => void;
    selectedMoveNodeKeys: TreeCheckboxSelectionKeys | null;
    setSelectedMoveNodeKeys: (keys: TreeCheckboxSelectionKeys | null) => void;
}

export const PalFilterContext = createContext<PalFilterContextType | null>(null);

export const PalFilterProvider: FC<PropsWithChildren> = ({children}) => {
    const [moveFilterTree, setMoveFilterTree] = useState<TreeNode[]>([]);
    const [selectedMoveNodeKeys, setSelectedMoveNodeKeys] = useState<TreeCheckboxSelectionKeys | null>(null);

    return (
        <PalFilterContext.Provider
            value={{
                moveFilterTree,
                setMoveFilterTree,
                selectedMoveNodeKeys,
                setSelectedMoveNodeKeys
            }}>
            {children}
        </PalFilterContext.Provider>
    );
};
