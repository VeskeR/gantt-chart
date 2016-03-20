'use strict';

var constants = {
  chartJsonExample: {
    startTime: '2016-3-1',
    endTime: '2016-3-31',
    rows: [
      {
        name: 'Requirements',
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
        blocks: [
          {
            name: 'Setup',
            startTime: '2016-3-4',
            endTime: '2016-3-8'
          }
        ]
      },
      {
        name: 'Development',
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
        blocks: [
          {
            name: 'Integration Tests',
            startTime: '2016-3-16',
            endTime: '2016-3-18'
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
        blocks: [
          {
            name: 'Training',
            startTime: '2016-3-24',
            endTime: '2016-3-26'
          }
        ]
      },
      {
        name: 'Support',
        blocks: [
          {
            name: 'Support',
            startTime: '2016-3-26',
            endTime: '2016-3-31'
          }
        ]
      },
      {
        name: 'Project Management',
        blocks: [
          {
            name: 'Project Management',
            startTime: '2016-3-1',
            endTime: '2016-3-31'
          }
        ]
      }
    ]
  },
  blockColors: [
    '#E88D67',
    '#BB999C',
    '#9999C3',
    '#7B8CDE',
    '#C0E6DE'
  ]
}

module.exports = constants;
