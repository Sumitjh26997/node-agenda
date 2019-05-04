drone = require('schedule-drone')
drone.setConfig({
    persistence:{
        type: 'mongodb',
        connectionString: 'mongodb://localhost:27017/scheduled-events',
        options: {} }
    })
scheduler = drone.daemon()

scheduler.schedule('* * * * * 1', 'my-cron-event', params)
