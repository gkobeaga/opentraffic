Cue.addJob('checkReports', {retryOnError:false, maxMs:1000*60*2}, function(task, done) {
    checkReports();
    done();
});



checkReports = function() {
    // which users have we already tested
    var testedUserIds = [];

    Reports.find({active:true}).forEach(function(report) {

        if (!_.contains(testedUserIds, report.user_id)) {

            var find = {user_id:report.user_id, active:true};
            var sort = {createdAt:1};
            var fields = {createdAt:1};

            var oldest = Reports.findOne(find, {sort:sort, fields:fields});
            var numReports = Reports.find(find).count();

            if (oldest && numReports) {
                var reportDate = moment(oldest.createdAt);
                var pastTime = moment() - reportDate;
                var length = reportDuration(numReports);
                var timeLeft = length - pastTime;

                if (timeLeft <= 0) {
                    Reports.update(find, {$set:{active:false}}, {multi:true});
                }
            }

            testedUserIds.push(report.user_id);
        }
    });
};
