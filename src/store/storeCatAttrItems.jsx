import create from 'zustand'

const useStore = create(set => ({
  CatAttrItems: [],
  loading: false,
  addCatAttrItems: (items) => set(state => ({ CatAttrItems: [...state.CatAttrItems, items ]})),
  removeCatAttrItems: () => set(({ CatAttrItems: [] }))
 
}))

export default useStore;