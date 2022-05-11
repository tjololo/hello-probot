import { Probot } from "probot";

export = (app: Probot) => {
  app.on("pull_request.opened", async (context) => {
    const pr = context.payload.pull_request
    if (pr.head.repo?.fork) {
      context.octokit.issues.addLabels(context.issue({
        labels: ["external-pr:heart:", "needs-attention"]
      }));
      context.octokit.issues.createComment(context.issue({
        body: "Thanks for your contribution. A real person will come along as soon as possible!"
      }))
    } else {
      context.octokit.issues.addLabels(context.issue({
        labels: ["internal", "needs-attention"]
      }));
    }
  });

  app.on("pull_request.assigned", async (context) => {
    const pr = context.payload.pull_request
    if (pr.labels.filter(l => l.name == "needs-attention").length > 0) {
      context.octokit.issues.removeLabel(context.issue({
        name: "needs-attention"
      }));
    }
  });

  app.on("pull_request.unassigned", async (context) =>{
    if (context.payload.pull_request.assignees.length == 0){
      context.octokit.issues.addLabels(context.issue({
        labels: ["needs-attention"]
      }));
    }
  });
  // app.on("issues.opened", async (context) => {
  //   const issueComment = context.issue({
  //     body: "Thanks for opening this issue!",
  //   });
  //   await context.octokit.issues.createComment(issueComment);
  // });
  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};