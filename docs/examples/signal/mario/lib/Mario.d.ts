export declare enum Activity {
    Walking = "walk",
    Standing = "stand",
    Jumping = "jump"
}
export declare enum Direction {
    Left = "left",
    Right = "right"
}
export declare type Character = {
    node: HTMLElement;
    x: number;
    y: number;
    dx: number;
    dy: number;
    dir: Direction;
};
export interface Inputs {
    left: boolean;
    right: boolean;
    jump: boolean;
}
export declare const charSpriteDescriptor: (c: Character) => string;
export declare const marioLogic: (inputs: Inputs) => (a: Character) => Character;
