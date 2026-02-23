import {App, ButtonComponent, PluginSettingTab, Setting} from "obsidian";
import TodaysLinkObsidian from "./main";

export interface TodaysLinkSettings {
	ShortcutName: string;
	DailyNoteFileName: string;
	LastShortcutCharCode: number;
}

export const DEFAULT_SETTINGS: TodaysLinkSettings = {
	ShortcutName: 'today',
	DailyNoteFileName: '',
	LastShortcutCharCode: -1
}

export function GetAndSetDailyNotesFormat(app: App, settings: TodaysLinkSettings){
    // TODO: add an option to override the DailyNoteFileName
    const dailyNotesPlugin = app.internalPlugins?.getPluginById?.("daily-notes");
    if(!dailyNotesPlugin || !dailyNotesPlugin?.enabled){
        throw new Error("TodaysLink: Daily Notes core plugin is not enabled. Disabling plugin.");
    }
    const instance = dailyNotesPlugin?.instance;
    const format = instance?.getFormat() as string | undefined;
    if(!format){
        throw new Error("TodaysLink: Daily Notes doesn't have date format. Disabling plugin.");
    }
    settings.DailyNoteFileName = format.includes("/") 
        ? format.substring(format.lastIndexOf("/") + 1) 
        : format; // get the note name from DN format
}

export function GetAndSetLastShortcutCharCode(settings: TodaysLinkSettings){
    settings.LastShortcutCharCode = settings.ShortcutName.charCodeAt(settings.ShortcutName.length - 1);
}

export class TodaysLinkSettingsTab extends PluginSettingTab {
	plugin: TodaysLinkObsidian;

	constructor(app: App, plugin: TodaysLinkObsidian) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Shortcut for today\'s daily note')
			.setDesc('The shortcut to use instead of [[today]] for today\'s daily note')
			.addText(text => text
				.setPlaceholder('today')
				.setValue(this.plugin.settings.ShortcutName)
				.onChange(async (value) => {
					this.plugin.settings.ShortcutName = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Reload daily note format')
			.addButton(ButtonComponent)
	}
}
