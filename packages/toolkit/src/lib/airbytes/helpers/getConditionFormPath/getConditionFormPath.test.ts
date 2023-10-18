import { test, expect } from "vitest";
import { getConditionFormPath } from "./getConditionFormPath";
import { AirbyteFormConditionItem } from "../../types";

test("should find path from a simple condition form", () => {
  const form: AirbyteFormConditionItem = {
    description:
      "Whether to initiate an SSH tunnel before connecting to the database, and if so, which kind of authentication to use.",
    title: "SSH Tunnel Method",
    _type: "formCondition",
    path: "tunnel_method",
    fieldKey: "tunnel_method",
    conditions: {
      "No Tunnel": {
        title: "No Tunnel",
        _type: "formGroup",
        jsonSchema: {
          properties: {
            tunnel_method: {
              const: "NO_TUNNEL",
              description: "No ssh tunnel needed to connect to database",
              order: 0,
              type: "string",
            },
          },
          required: ["tunnel_method"],
          title: "No Tunnel",
          type: "object",
        },
        path: "tunnel_method",
        fieldKey: "tunnel_method",
        properties: [
          {
            const: "NO_TUNNEL",
            description: "No ssh tunnel needed to connect to database",
            order: 0,
            _type: "formItem",
            path: "tunnel_method.tunnel_method",
            fieldKey: "tunnel_method",
            isRequired: true,
            isSecret: false,
            multiline: false,
            type: "string",
          },
        ],
        isRequired: false,
      },
    },
    isRequired: false,
  };

  const path = getConditionFormPath(form);
  expect(path).toStrictEqual("tunnel_method.tunnel_method");
});

test("find path when some of the const field is missing", () => {
  const form: AirbyteFormConditionItem = {
    description:
      "Whether to initiate an SSH tunnel before connecting to the database, and if so, which kind of authentication to use.",
    title: "SSH Tunnel Method",
    _type: "formCondition",
    path: "tunnel_method",
    fieldKey: "tunnel_method",
    conditions: {
      "No Tunnel": {
        title: "No Tunnel",
        _type: "formGroup",
        jsonSchema: {
          properties: {
            tunnel_method: {
              const: "NO_TUNNEL",
              description: "No ssh tunnel needed to connect to database",
              order: 0,
              type: "string",
            },
          },
          required: ["tunnel_method"],
          title: "No Tunnel",
          type: "object",
        },
        path: "tunnel_method",
        fieldKey: "tunnel_method",
        properties: [],
        isRequired: false,
      },
      "SSH Key Authentication": {
        title: "SSH Key Authentication",
        _type: "formGroup",
        jsonSchema: {
          properties: {
            ssh_key: {
              credential_field: true,
              description:
                "OS-level user account ssh key credentials in RSA PEM format ( created with ssh-keygen -t rsa -m PEM -f myuser_rsa )",
              multiline: true,
              order: 4,
              title: "SSH Private Key",
              type: "string",
            },
            tunnel_host: {
              description:
                "Hostname of the jump server host that allows inbound ssh tunnel.",
              order: 1,
              title: "SSH Tunnel Jump Server Host",
              type: "string",
            },
          },
          required: ["tunnel_host", "ssh_key"],
          title: "SSH Key Authentication",
          type: "object",
        },
        path: "tunnel_method",
        fieldKey: "tunnel_method",
        properties: [
          {
            const: "SSH_KEY_AUTH",
            description:
              "Connect through a jump server tunnel host using username and ssh key",
            order: 0,
            _type: "formItem",
            path: "tunnel_method.tunnel_method",
            fieldKey: "tunnel_method",
            isRequired: true,
            isSecret: false,
            multiline: false,
            type: "string",
          },
          {
            description:
              "Hostname of the jump server host that allows inbound ssh tunnel.",
            order: 1,
            title: "SSH Tunnel Jump Server Host",
            _type: "formItem",
            path: "tunnel_method.tunnel_host",
            fieldKey: "tunnel_host",
            isRequired: true,
            isSecret: false,
            multiline: false,
            type: "string",
          },
          {
            description:
              "OS-level user account ssh key credentials in RSA PEM format ( created with ssh-keygen -t rsa -m PEM -f myuser_rsa )",
            order: 4,
            title: "SSH Private Key",
            _type: "formItem",
            path: "tunnel_method.ssh_key",
            fieldKey: "ssh_key",
            isRequired: true,
            isSecret: true,
            multiline: true,
            type: "string",
          },
        ],
        isRequired: false,
      },
    },
    isRequired: false,
  };

  const path = getConditionFormPath(form);
  expect(path).toStrictEqual("tunnel_method.tunnel_method");
});
