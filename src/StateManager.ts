//StateManager.ts
import React from "react";

export class StateManager {
    private state: Record<string, any> = {};
    private subscriptions: Record<string, Array<() => void>> = {};

    public get(key: string): any {
        return this.state[key];
    }

    public set(key: string, value: any): void {
        this.state[key] = value;
        this.notifySubscribers(key);
    }

    public subscribe(key: string, callback: () => void): void {
        if (!this.subscriptions[key]) {
            this.subscriptions[key] = [];
        }
        this.subscriptions[key].push(callback);
    }

    public unsubscribe(key: string, callback: () => void): () => void {
        if (!this.subscriptions[key]) {
            return () => {};
        }
        const index = this.subscriptions[key].indexOf(callback);
        if (index === -1) {
            return () => {};
        }
        this.subscriptions[key].splice(index, 1);
        return () => {
            this.subscriptions[key].push(callback);
        };
    }


    private notifySubscribers(key: string): void {
        if (!this.subscriptions[key]) {
            return;
        }
        this.subscriptions[key].forEach((subscriber) => subscriber());
    }
}

export const StateContext = React.createContext<StateManager>(new StateManager());
