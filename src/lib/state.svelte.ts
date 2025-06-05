export interface State {
	generating: boolean;
	audios: { [key: string]: string };
}

export const state: State = $state({
	generating: false,
	audios: {}
});
