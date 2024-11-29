public with sharing class StudentController {
  @AuraEnabled
  public static List<Student__c> getStudents() {
    return [
      SELECT
        code__c,
        firstName__c,
        lastName__c,
        status__c,
        diem1__c,
        diem2__c,
        diem3__c,
        diemTB__c,
        gender__c,
        Name,
        grade__c
      FROM Student__c
    ];
  }

  @AuraEnabled
  // public static String addStudent(Object fields) {
  //     // Ép kiểu fields thành Map
  //     Map<Object, Object> fieldMap = (Map<Object, Object>) fields;
  //     System.debug('fields: ' + fieldMap);

  //     try {
  //         // Tạo một đối tượng Student__c và gán các giá trị từ Map
  //         Student__c student = new Student__c(
  //             firstName__c = (String) fieldMap.get('firstName__c'),
  //             lastName__c = (String) fieldMap.get('lastName__c'),
  //             birthday__c = Date.valueOf((String) fieldMap.get('birthday__c')),
  //             diem1__c = Decimal.valueOf((String) fieldMap.get('diem1__c')),
  //             diem2__c = Decimal.valueOf((String) fieldMap.get('diem2__c')),
  //             diem3__c = Decimal.valueOf((String) fieldMap.get('diem3__c')),
  //             gender__c = (String) fieldMap.get('gender__c'),
  //             grade__c = (Id) fieldMap.get('grade__c')
  //         );

  //         // Thêm bản ghi vào Salesforce
  //         insert student;
  //         System.debug('data inserted: ' + student.Id);

  //         return student.Id;

  //     } catch (Exception e) {
  //         // Ghi log lỗi và ném Exception để xử lý ở frontend
  //         System.debug('Error: ' + e.getMessage());
  //         throw new AuraHandledException(e.getMessage());
  //     }
  // }

  public static String addStudent(
    String firstName,
    String lastName,
    Date birthday,
    Decimal diem1,
    Decimal diem2,
    Decimal diem3,
    String gender,
    String grade
  ) {
    try {
      // Tạo một đối tượng Student__c và gán các giá trị từ Map
      Student__c student = new Student__c(
        firstName__c = firstName,
        lastName__c = lastName,
        birthday__c = birthday,
        diem1__c = diem1,
        diem2__c = diem2,
        diem3__c = diem2,
        gender__c = gender,
        grade__c = grade
      );

      insert student;
      // System.debug('data inserted: ' + student.Id);
      return student.Id;
    } catch (Exception e) {
      // Ghi log lỗi và ném Exception để xử lý ở frontend
      System.debug('Error: ' + e.getMessage());
      throw new AuraHandledException(e.getMessage());
    }
  }
}
