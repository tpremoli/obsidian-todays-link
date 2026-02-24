import { App, PluginSettingTab, Setting } from "obsidian";
import TodaysLinkObsidian from "./main";
import {AppWithDailyNotesPlugin, DailyNotesPlugin} from "./types";

export interface TodaysLinkSettings {
	ShortcutName: string;
	DailyNoteFileName: string | undefined;
	LastShortcutCharCode: number | undefined;
}

export const DEFAULT_SETTINGS: TodaysLinkSettings = {
	ShortcutName: 'today',
	DailyNoteFileName: undefined,
	LastShortcutCharCode: undefined
}

// TODO: add an option to override the DailyNoteFileName
export function GetAndSetDailyNotesFormat(app: App, settings: TodaysLinkSettings) {
	// Using this internalPlugins is common but unofficial API
	const dailyNotesPlugin: DailyNotesPlugin = (app as AppWithDailyNotesPlugin).internalPlugins.getPluginById("daily-notes");
	if (!dailyNotesPlugin || !dailyNotesPlugin.enabled) {
		throw new Error("TodaysLink: Daily Notes core plugin is not enabled. Disabling plugin.");
	}
	const format = dailyNotesPlugin.instance.getFormat() as string | undefined;
	if (!format) {
		throw new Error("TodaysLink: Daily Notes doesn't have date format. Disabling plugin.");
	}
	settings.DailyNoteFileName = format.includes("/")
		? format.substring(format.lastIndexOf("/") + 1)
		: format; // get the note name from DN format
}

export function GetAndSetLastShortcutCharCode(settings: TodaysLinkSettings) {
	settings.LastShortcutCharCode = settings.ShortcutName.charCodeAt(settings.ShortcutName.length - 1);
}

export class TodaysLinkSettingsTab extends PluginSettingTab {
	plugin: TodaysLinkObsidian;

	constructor(app: App, plugin: TodaysLinkObsidian) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Shortcut for today\'s daily note')
			.setDesc('The shortcut to use instead of [[today]] for today\'s daily note')
			.addText(text => text
				.setValue(this.plugin.settings.ShortcutName)
				.onChange(async (value) => {
					this.plugin.settings.ShortcutName = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Reload daily note date format')
			.setDesc(`Current format: ${this.plugin.settings.DailyNoteFileName}`)
			.addButton(button => button
				.setButtonText('Reload')
				.onClick(() => {
					GetAndSetDailyNotesFormat(this.app, this.plugin.settings);
					// refresh "current format"
					this.display();
				})
			);
	}
}
