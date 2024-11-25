import { create } from "zustand";


export const userConversation = create((set) => ({
    selectedConversation: null,
    setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
    messages: [],
    setMessage: (messages) => set({ messages }),
}))

