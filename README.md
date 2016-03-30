# Gantt chart builder
This is implementation of front-end task for qualifying stage of uawebchallenge 2016.

## Building
Project uses grunt as task manager. To install it and all needed dependencies simply run
```
npm install
```
To build the project run
```
grunt build
```
You can find builded project in a `dist` folder.

## Local development
You might want to view all your changes to application locally. Simply run
```
grunt serve
```
Now you are ready for development.

## chart.json format
Information about chart is stored in file named 'chart.json' in 'scripts' folder.
Application expects next format of chart.json:
```
{
  startTime: [date],     // Start time of chart that can be parsed by Date.parse
  endTime: [date],       // End time of chart that can be parsed by Date.parse
  blocks: [              // Array of chart blocks. Must contain at least one element
    {
      name: [string],    // Name of chart block
      startTime: [date], // Start time of chart block that can be parsed by Date.parse
      endTime: [date],   // End time of chart block that can be parsed by Date.parse
      blocks: [          // Blocks can have nested blocks with the same format. Level of nesting is not capped
        {
          name: [string],
          startTime: [date],
          endTime: [date],
          blocks: [
            ...
          ]
        },
        ...
      ]
    },
    ...
  ]
}
```
In case of invalid 'chart.json' format chart will not be generated and console will contain messages about occurred errors.
