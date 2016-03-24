'use strict';

var constants = {
  chartJsonExample: {
    startTime: '2016-1-5',
    endTime: '2016-2-16',
    blocks: [
      {
        name: 'Requirements',
        startTime: '2016-1-8',
        endTime: '2016-1-18',
        blocks: [
          {
            name: 'Request Open',
            startTime: '2016-1-8',
            endTime: '2016-1-12'
          },
          {
            name: 'Under Review',
            startTime: '2016-1-12',
            endTime: '2016-1-16'
          },
          {
            name: 'Selected For Development',
            startTime: '2016-1-16',
            endTime: '2016-1-18'
          }
        ]
      },
      {
        name: 'Setup',
        startTime: '2016-1-16',
        endTime: '2016-1-20'
      },
      {
        name: 'Development',
        startTime: '2016-1-16',
        endTime: '2016-1-26',
        blocks: [
          {
            name: 'Coding',
            startTime: '2016-1-16',
            endTime: '2016-1-26'
          }
        ]
      },
      {
        name: 'Testing',
        startTime: '2016-1-26',
        endTime: '2016-1-31',
        blocks: [
          {
            name: 'Integration Tests',
            startTime: '2016-1-26',
            endTime: '2016-1-28'
          },
          {
            name: 'Customer Tests',
            startTime: '2016-1-28',
            endTime: '2016-1-31'
          }
        ]
      },
      {
        name: 'Deployment',
        startTime: '2016-1-31',
        endTime: '2016-2-4',
        blocks: [
          {
            name: 'Setup',
            startTime: '2016-1-31',
            endTime: '2016-2-2'
          },
          {
            name: 'Demo Launch',
            startTime: '2016-2-2',
            endTime: '2016-2-3'
          },
          {
            name: 'Go-Live!',
            startTime: '2016-2-3',
            endTime: '2016-2-4'
          }
        ]
      },
      {
        name: 'Training',
        startTime: '2016-2-3',
        endTime: '2016-2-6'
      },
      {
        name: 'Support',
        startTime: '2016-2-6',
        endTime: '2016-2-16'
      },
      {
        name: 'Project Management',
        startTime: '2016-1-8',
        endTime: '2016-2-16'
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
