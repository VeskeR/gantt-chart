'use strict';

var constants = {
  chartJsonExample: {
    startTime: '2016-3-1',
    endTime: '2016-3-31',
    blocks: [
      {
        name: 'Requirements',
        startTime: '2016-3-1',
        endTime: '2016-3-4',
        blocks: [
          {
            name: 'Review',
            startTime: '2016-3-1',
            endTime: '2016-3-4'
          }
        ]
      },
      {
        name: 'Setup',
        startTime: '2016-3-4',
        endTime: '2016-3-8'
      },
      {
        name: 'Development',
        startTime: '2016-3-8',
        endTime: '2016-3-16',
        blocks: [
          {
            name: 'Coding',
            startTime: '2016-3-8',
            endTime: '2016-3-16'
          }
        ]
      },
      {
        name: 'Testing',
        startTime: '2016-3-14',
        endTime: '2016-3-20',
        blocks: [
          {
            name: 'Unit Tests',
            startTime: '2016-3-14',
            endTime: '2016-3-16'
          },
          {
            name: 'Integration Tests',
            startTime: '2016-3-16',
            endTime: '2016-3-18',
            blocks: [
              {
                name: 'Bottom Up Testing',
                startTime: '2016-3-16',
                endTime: '2016-3-17'
              },
              {
                name: 'Top Down Testing',
                startTime: '2016-3-17',
                endTime: '2016-3-18'
              }
            ]
          },
          {
            name: 'Customer Tests',
            startTime: '2016-3-18',
            endTime: '2016-3-20'
          }
        ]
      },
      {
        name: 'Deployment',
        startTime: '2016-3-20',
        endTime: '2016-3-25',
        blocks: [
          {
            name: 'Setup',
            startTime: '2016-3-20',
            endTime: '2016-3-24'
          },
          {
            name: 'Go-Live!',
            startTime: '2016-3-24',
            endTime: '2016-3-25'
          }
        ]
      },
      {
        name: 'Training',
        startTime: '2016-3-24',
        endTime: '2016-3-26'
      },
      {
        name: 'Support',
        startTime: '2016-3-26',
        endTime: '2016-3-31'
      },
      {
        name: 'Project Management',
        startTime: '2016-3-1',
        endTime: '2016-3-31'
      }
    ]
  },
  blockColors: [
    '#247BA0',
    '#70C1B3',
    '#B2DBBF',
    '#F3FFBD',
    '#F0B67F',
    '#FE5F55',
    '#D6D1B1',
    '#C7EFCF',
    '#EEF5DB'
  ]
}

module.exports = constants;
