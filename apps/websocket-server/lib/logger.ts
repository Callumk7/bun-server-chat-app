import { Console } from "node:console";
import fs from "node:fs";

export const logger = new Console({
	stdout: fs.createWriteStream("normalLog.txt"),
	stderr: fs.createWriteStream("errorLog.txt"),
});
