import * as Github from "github";

export namespace Types {
  export type Config = {
    label?: string;
  };

  export type Label = {
    name: string;
    color: string;
  };

  export type Issue = {
    number: number;
    labels?: Label[];
    [x: string]: any;
  };

  export type PullRequest = {
    number: number;
    labels?: Label[];
    [x: string]: any;
  };

  export type Comment = {
    user: {
      login: string;
      [x: string]: any;
    };
    author_association: string;
    [x: string]: any;
  };

  export type Context = {
    repo: () => { owner: string; repo: string };
    config: (path: string) => Config;
    isBot: boolean;
    github: Github;
    payload: {
      action: string;
      issue?: Issue;
      pull_request?: PullRequest;
      comment?: Comment;
    };
  };
}
