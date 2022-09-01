import getFieldPaths from "./getFieldsPaths";
import { AirbyteFormTree } from "./types";

test("should get paths from single formItem", () => {
  const formTree: AirbyteFormTree = {
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
  };

  const paths = getFieldPaths(formTree, false);
  expect(paths).toEqual(["tunnel_method.tunnel_method"]);
});

test("should get paths from single formGroup", () => {
  const formTree: AirbyteFormTree = {
    _type: "formGroup",
    fieldKey: "key",
    path: "key",
    isRequired: true,
    jsonSchema: {
      properties: {
        host: {
          description: "Hostname of the database.",
          type: "string",
        },
      },
      required: ["host"],
      title: "Postgres Source Spec",
      type: "object",
    },
    properties: [
      {
        _type: "formItem",
        description: "Hostname of the database.",
        fieldKey: "host",
        path: "key.host",
        isRequired: true,
        isSecret: false,
        multiline: false,
        type: "string",
      },
    ],
    title: "Postgres Source Spec",
  };

  const paths = getFieldPaths(formTree, false);
  expect(paths).toEqual(["key.host"]);
});

test("should get paths from multiple formGroups", () => {
  const formTrees: AirbyteFormTree[] = [
    {
      _type: "formGroup",
      fieldKey: "foo",
      path: "foo",
      isRequired: true,
      jsonSchema: {
        properties: {
          host: {
            description: "Hostname of the database.",
            type: "string",
          },
        },
        required: ["host"],
        title: "Postgres Source Spec",
        type: "object",
      },
      properties: [
        {
          _type: "formItem",
          description: "Hostname of the database.",
          fieldKey: "host",
          path: "foo.host",
          isRequired: true,
          isSecret: false,
          multiline: false,
          type: "string",
        },
      ],
      title: "Postgres Source Spec",
    },
    {
      _type: "formGroup",
      fieldKey: "bar",
      path: "bar",
      isRequired: true,
      jsonSchema: {
        properties: {
          port: {
            description: "Hostname of the database.",
            type: "string",
          },
        },
        required: ["port"],
        title: "Postgres Source Spec",
        type: "object",
      },
      properties: [
        {
          _type: "formItem",
          description: "Hostname of the database.",
          fieldKey: "port",
          path: "bar.port",
          isRequired: true,
          isSecret: false,
          multiline: false,
          type: "string",
        },
      ],
      title: "Postgres Source Spec",
    },
  ];

  const paths = getFieldPaths(formTrees, false);
  expect(paths).toEqual(["foo.host", "bar.port"]);
});

test("should get path from conditionForm and force paths to be unique", () => {
  const formTree: AirbyteFormTree = {
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
      "SSH Key Authentication": {
        title: "SSH Key Authentication",
        _type: "formGroup",
        jsonSchema: {
          properties: {
            ssh_key: {
              airbyte_secret: true,
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

  const paths = getFieldPaths(formTree, true);
  expect(paths).toEqual([
    "tunnel_method.tunnel_method",
    "tunnel_method.tunnel_host",
    "tunnel_method.ssh_key",
  ]);
});

test("should get path from conditionForm and not forcing paths to be unique", () => {
  const formTree: AirbyteFormTree = {
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
      "SSH Key Authentication": {
        title: "SSH Key Authentication",
        _type: "formGroup",
        jsonSchema: {
          properties: {
            ssh_key: {
              airbyte_secret: true,
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

  const paths = getFieldPaths(formTree, false);
  expect(paths).toEqual([
    "tunnel_method.tunnel_method",
    "tunnel_method.tunnel_method",
    "tunnel_method.tunnel_host",
    "tunnel_method.ssh_key",
  ]);
});
