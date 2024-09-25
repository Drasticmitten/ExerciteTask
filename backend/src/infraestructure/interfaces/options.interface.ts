import { Router } from "express";

export interface Options {
    port: number;
    routes: Router;
    public_path?: string;
}