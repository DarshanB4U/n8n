import { prisma } from "@repo/db";
import { INode, INodeData, TriggerNodetype } from "@repo/types/zodSchema";
import { sendMail, SendTG } from "./services";
import { getCredById } from "./controllers/dbControllers";
import SendmailTransport from "nodemailer/lib/sendmail-transport";
import { send } from "process";

interface edges {
  id: string;
  source: string;
  target: string;
}
type Wf = Array<INode>;

function getTriggerId(nodes: Wf) {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i]?.type === "Trigger_Webhook" || TriggerNodetype.manualTrigger) {
      return nodes[i]?.id;
    }
  }
}

const CreateAdjecencyList = (edges: edges[]) => {
  const graph = new Map<string, Set<string>>();

  function setNode(node: string) {
    if (!graph.has(node)) {
      graph.set(node, new Set());
    } else {
      console.log(`this node ${node} already exist on graph `);
    }
  }

  function setEdge(source: string, destination: string) {
    if (graph.has(source) && graph.has(destination)) {
      graph.get(source)?.add(destination);
    } else {
      console.log(`this nodes ${source},${destination} dont exist on graph `);
    }
  }

  for (let i = 0; i < edges.length; i++) {
    setNode(edges[i]?.source as string);
    setNode(edges[i]?.target as string);
  }

  for (let i = 0; i < edges.length; i++) {
    setEdge(edges[i]?.source as string, edges[i]?.target as string);
  }
  return graph;
};

class Queue<T = any> {
  private queue: T[] = [];

  push(item: T) {
    this.queue.push(item); // enqueue
  }

  pop(): T | undefined {
    return this.queue.shift(); // dequeue
  }

  isEmpty(): boolean {
    return this.queue.length === 0;
  }

  size(): number {
    return this.queue.length;
  }
}

export const execute = async (workflowId: string) => {
  const q = new Queue();

  //fetch workflow from db
  const workflow = await prisma.workflow.findFirst({
    where: {
      id: workflowId,
    },
  });

  if (!workflow) {
    return console.log("error fetching workflow");
  }

  const nodes = workflow.nodes as unknown as Wf;

  const nodesMap = new Map(nodes.map((n) => [n.id, n]));

  const edges = workflow?.edges as unknown as edges[];

  // create adjcency list form workflow edges
  const adjcencyList = CreateAdjecencyList(edges);

  //find the terigger node
  const TriggerId = getTriggerId(nodes);

  q.push(TriggerId);

  while (true) {
    if (q.isEmpty()) {
      return;
    }
    const nodeid = q.pop();
    // console.log(nodeid);
    const nodeSet = adjcencyList.get(nodeid);
    if (!nodeSet) {
      console.log("set is undefined");
      break;
    }
    if (nodeSet.size == 0) {
      console.log("set is empty ");
      break;
    }

    for (const item of nodeSet) {
      const node = nodesMap.get(item);

      console.log(node?.id, "executed");
      if (node?.data.nodeRegid == 1) {
        const emailCred = await getCredById(
          node.data.Credentials?.CredentialId as string
        );
        console.log("email credentials logs ", emailCred);
        await sendMail(
          emailCred as string,
          node.data.Parameters.from as string,
          node.data.Parameters.to as string,
          node.data.Parameters.body as string,
          node.data.Parameters.subject as string
        );
      }
      if (node?.data.nodeRegid == 2) {
        const TelegramToken = await getCredById(
          node.data.Credentials.CredentialId as string
        );

        await SendTG(
          TelegramToken as string,
          node.data.Parameters.chat_id as string | number,
          node.data.Parameters.text as string
        );
      }

      q.push(item);
    }
  }

  //add the child of the trigger node to q
  // ass eexcte the nodes node if node has child then add it child to que
};
