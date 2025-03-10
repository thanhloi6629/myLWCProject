public class ThemeController {
    public Theme__c themeRecord { get; set; }
    public List<SelectOption> recordTypeOptions { get; set; }
    public String selectedRecordTypeId { get; set; }

    public ThemeController() {
        themeRecord = new Theme__c();
        recordTypeOptions = new List<SelectOption>();
        // loadRecordTypes();
    }

    // private void loadRecordTypes() {
    //     Schema.DescribeSObjectResult describeResult = Schema.SObjectType.Theme__c;
    //     List<RecordTypeInfo> recordTypes = describeResult.getRecordTypeInfos();
    //     for (RecordTypeInfo rt : recordTypes) {
    //         if (rt.isAvailable() && !rt.isMaster()) {
    //             recordTypeOptions.add(new SelectOption(rt.getRecordTypeId(), rt.getName()));
    //         }
    //     }
    // }

    public List<SelectOption> getRecordTypes() {
        List<SelectOption> options = new List<SelectOption>();
        options.add(new SelectOption('', '... None ...')); // Dòng mặc định
        for (RecordType rt : [SELECT Id, Name FROM RecordType WHERE SObjectType = 'Theme__c']) {
            options.add(new SelectOption(rt.Id, rt.Name));
        }
        return options;
    }




    public PageReference saveRecord() {
        system.debug('selectedRecordTypeId: ' + selectedRecordTypeId);
        system.debug('themeRecord123: ' + themeRecord.Name);

        try {
            themeRecord.RecordTypeId = selectedRecordTypeId;
            themeRecord.Name = themeRecord.Name;
            themeRecord.Update_Content__c = themeRecord.Update_Content__c;
            system.debug('vapday khong1: ');
            insert themeRecord;
            system.debug('vapday khong2: ');
            // Chuyển hướng đến trang chi tiết của bản ghi vừa tạo
            PageReference detailPage = new PageReference('/' + themeRecord.Id);
            detailPage.setRedirect(true);
            return detailPage;
        } catch (Exception e) {
            ApexPages.addMessage(new ApexPages.Message(ApexPages.Severity.ERROR, 'Error creating record: ' + e.getMessage()));
        }
        return null; // Giữ nguyên trang hiện tại
    }

    public PageReference cancel() {
        System.debug('variable: ');
        PageReference listViewPage = new PageReference('/lightning/o/Theme__c/list?filterName=__Recent');
        listViewPage.setRedirect(true);
        return listViewPage;
    }
}