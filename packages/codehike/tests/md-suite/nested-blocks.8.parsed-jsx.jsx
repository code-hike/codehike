var block = {
  "_data": {
    "header": "",
  },
  "children": <React.Fragment>
    <p>
      hello
    </p>
    <p>
      hey
    </p>
  </React.Fragment>,
  "one": {
    "_data": {
      "header": "# !one uno",
    },
    "children": <React.Fragment>
      <p>
        1
      </p>
      <p>
        ho
      </p>
    </React.Fragment>,
    "extra": {
      "_data": {
        "header": "## !extra",
      },
      "children": <p>
        extra
      </p>,
      "title": "",
    },
    "foo": [
      {
        "_data": {
          "header": "## !!foo 111",
        },
        "bar": {
          "_data": {
            "header": "### !bar b",
          },
          "children": <p>
            1.1.1
          </p>,
          "title": "b",
        },
        "children": <React.Fragment>
          <p>
            1.1
          </p>
          <p>
            more
          </p>
        </React.Fragment>,
        "title": "111",
      },
      {
        "_data": {
          "header": "## !!foo 222",
        },
        "children": <p>
          hey
        </p>,
        "title": "222",
      },
    ],
    "title": "uno",
  },
  "title": "",
}