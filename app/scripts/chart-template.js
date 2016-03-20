'use strict';
var chart = {
  startTime: '2016-3-1',
  endTime: '2016-3-31',
  rows: [
    {
      name: 'Requirements',
      blocks: [
        {
          name: 'Review',
          startTime: '2016-3-1',
          endTime: '2016-3-2'
        }
      ]
    },
    {
      name: 'Setup',
      blocks: [
        {
          name: 'Setup',
          startTime: '2016-3-2',
          endTime: '2016-3-3'
        }
      ]
    },
    {
      name: 'Development',
      blocks: [
        {
          name: 'Coding',
          startTime: '2016-3-2',
          endTime: '2016-3-4'
        }
      ]
    },
    {
      name: 'Testing',
      blocks: [
        {
          name: 'Integration Tests',
          startTime: '2016-3-4',
          endTime: '2016-3-5'
        },
        {
          name: 'Customer Tests',
          startTime: '2016-3-5',
          endTime: '2016-3-6'
        }
      ]
    },
    {
      name: 'Deployment',
      blocks: [
        {
          name: 'Setup',
          startTime: '2016-3-6',
          endTime: '2016-3-7'
        },
        {
          name: 'Go-Live!',
          startTime: '2016-3-7',
          endTime: '2016-3-8'
        }
      ]
    },
    {
      name: 'Training',
      blocks: [
        {
          name: 'Training',
          startTime: '2016-3-8',
          endTime: '2016-3-9'
        }
      ]
    },
    {
      name: 'Support',
      blocks: [
        {
          name: 'Support',
          startTime: '2016-3-9',
          endTime: '2016-3-20'
        }
      ]
    },
    {
      name: 'Project Management',
      blocks: [
        {
          name: 'Project Management',
          startTime: '2016-3-1',
          endTime: '2016-3-20'
        }
      ]
    }
  ]
}

module.exports = chart;
