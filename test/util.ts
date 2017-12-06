import * as fs from "fs";
import * as path from "path";
import { createRobot } from "probot";
import plugin from "../src";

const fixtures = path.join(__dirname, "fixtures");
export const events = fs
  .readdirSync(fixtures)
  .map(file => path.join(fixtures, file))
  .reduce((result, filePath) => {
    const { name } = path.parse(filePath);
    const data = fs.readFileSync(filePath, "utf-8");
    return {
      ...result,
      [name]: JSON.parse(data)
    };
  }, {});

export namespace robot {
  const it = createRobot();
  plugin(it);

  export function use(github) {
    it.auth = () => Promise.resolve(github);
  }

  export function receive(payload) {
    return it.receive(payload);
  }
}
