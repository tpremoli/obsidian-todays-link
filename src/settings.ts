import {App, PluginSettingTab, Setting} from "obsidian";
import TodaysLinkObsidian from "./main";

export interface TodaysLinkSettings {
	ShortcutName: string;
	DailyNoteFileName: string;
}

export const DEFAULT_SETTINGS: TodaysLinkSettings = {
	ShortcutName: 'today',
	DailyNoteFileName: ''
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
	}
}
