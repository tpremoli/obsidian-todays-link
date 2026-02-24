import { App } from "obsidian";


export interface DailyNotesPlugin {
    enabled: boolean;
    instance: {
        getFormat(): string;
    };
}

export interface AppWithDailyNotesPlugin extends App {
    internalPlugins: {
        getPluginById(id: string): DailyNotesPlugin;
    };
}
