@isTest
private class ThemeControllerTest {
	@isTest
    static void testSaveRecord_Success() {
        // Lấy RecordTypeId từ setupTestData
        RecordType rt = [SELECT Id FROM RecordType WHERE SObjectType = 'Theme__c' LIMIT 1];

        // Khởi tạo controller
        ThemeController controller = new ThemeController();
        controller.selectedRecordTypeId = rt.Id;
        controller.themeRecord.Name = 'Test Theme';
        controller.themeRecord.Update_Content__c = 'This is a test content';

        // Gọi method saveRecord
        Test.startTest();
        PageReference result = controller.saveRecord();
        Test.stopTest();

        // Kiểm tra kết quả
        System.assertNotEquals(result, null, 'PageReference should not be null');
        System.assert(result.getUrl().contains('/'), 'URL must be valid');

        // Kiểm tra Theme__c đã được tạo
        Theme__c createdTheme = [SELECT Id, Name, Update_Content__c, RecordTypeId FROM Theme__c WHERE Name = 'Test Theme' LIMIT 1];
        System.assertNotEquals(createdTheme.Id, null, 'Theme__c record should be inserted');
        System.assertEquals(createdTheme.RecordTypeId, rt.Id, 'RecordTypeId should be assigned correctly');
    }
    
    @isTest
    static void testCancel() {
        // Khởi tạo controller
        ThemeController controller = new ThemeController();

        // Gọi method cancel
        Test.startTest();
        PageReference result = controller.cancel();
        Test.stopTest();

    }
    
    @isTest
    static void testSaveRecord() {
        RecordType rt = [SELECT Id FROM RecordType WHERE SObjectType = 'Theme__c' LIMIT 1];

        ThemeController controller = new ThemeController();
        controller.selectedRecordTypeId = rt.Id;
        controller.themeRecord.Name = 'Test Theme';
        controller.themeRecord.Update_Content__c = 'This is a test content';

        Test.startTest();
        PageReference result = controller.saveRecord();
        Test.stopTest();

        // Kiểm tra record đã được tạo
        Theme__c createdTheme = [SELECT Id, RecordTypeId FROM Theme__c WHERE Name = 'Test Theme' LIMIT 1];
        System.assertNotEquals(createdTheme.Id, null, 'Theme__c record should be inserted');
        System.assertEquals(createdTheme.RecordTypeId, rt.Id, 'RecordTypeId should be assigned correctly');
        System.assertNotEquals(result, null, 'PageReference không được null');
    }
    
    @isTest
    static void testGetRecordTypes() {
        ThemeController controller = new ThemeController();

        Test.startTest();
        List<SelectOption> recordTypes = controller.getRecordTypes();
        Test.stopTest();

        // Kiểm tra danh sách không rỗng
        System.assert(recordTypes.size() > 0, 'Phải có ít nhất 1 RecordType');
    }
}