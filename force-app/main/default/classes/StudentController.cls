public with sharing class StudentController {

  public class PaginationStudent {
    @AuraEnabled
    public Integer totalRecords {get; set;}

    @AuraEnabled
    public Integer totalPage {get; set;}

    @AuraEnabled
    public List<Student__c> students {get; set;}
    
    public PaginationStudent(Integer totalRecords, List<Student__c> students, Integer totalPage) {
      this.totalRecords = totalRecords;
      this.students = students;
      this.totalPage = totalPage;
    }
  }

  @AuraEnabled
  public static PaginationStudent getStudentsPagination(
    Integer pageSize, 
    Integer pageNumber,  
    String name,
    String grade,
    String fromDate,
    String toDate,
    String sortField, 
    String sortOrder
    ) 
    {
    List<String> conditions = new List<String>();

    if (String.isNotBlank(name)) {
      conditions.add(
        'lastName__c LIKE \'%' + String.escapeSingleQuotes(name) + '%\''
      );
    }
    if (String.isNotBlank(grade)) {
      conditions.add(
        'grade__c = \'' + String.escapeSingleQuotes(grade) + '\''
      );
    }
    if (String.isNotBlank(fromDate)) {
      conditions.add('birthday__c >= ' + fromDate);
    }
    if (String.isNotBlank(toDate)) {
      conditions.add('birthday__c <= ' + toDate);
    }

    String baseQuery = 'SELECT Id, code__c, Name, firstName__c, lastName__c, status__c, diem1__c, diem2__c, diem3__c, birthday__c, gender__c, grade__c, diemTB__c FROM Student__c';

    if (!conditions.isEmpty()) {
      baseQuery = baseQuery + ' WHERE ' +  String.join(conditions, '  AND ');
    }

    List<Student__c> result = Database.query(baseQuery);
    Integer totalRecords = result.size();
    Integer offset = (pageNumber - 1) * pageSize;
   
    if (String.isNotBlank(sortField) && String.isNotBlank(sortOrder)) {
      baseQuery = baseQuery + ' ORDER BY ' + sortField + ' ' + sortOrder;
    } 
    baseQuery = baseQuery + ' LIMIT ' + pageSize + ' OFFSET ' + offset;

    List<Student__c> lst = Database.query(baseQuery);
  
    Integer totalPage = (Integer) Math.ceil( (Decimal) totalRecords / pageSize);
    return new PaginationStudent(totalRecords, lst, totalPage);
  }

  @AuraEnabled
  public static List<Grade__c> getGrades() {
    return [
      SELECT Id, Name
      FROM Grade__c
    ];
  }

  // @AuraEnabled
  // public static String addStudentV2(Map<String, Object> studentData) {
  //   System.debug('fields: ' + studentData);
  //   try {
  //     String grade = (String) studentData.get('grade');
  //     Grade__c gradeRecord = [
  //       SELECT Id
  //       FROM Grade__c
  //       WHERE code__c = :grade
  //       LIMIT 1
  //     ];

  //     Student__c student = new Student__c(
  //       Name = (String) studentData.get('Name'),
  //       firstName__c = (String) studentData.get('firstName__c'),
  //       lastName__c = (String) studentData.get('lastName__c'),
  //       birthday__c = studentData.containsKey('birthday__c')
  //         ? (Date) studentData.get('birthday__c')
  //         : null,
  //       diem1__c = studentData.containsKey('diem1__c')
  //         ? (Decimal) studentData.get('diem1__c')
  //         : null,
  //       diem2__c = studentData.containsKey('diem2__c')
  //         ? (Decimal) studentData.get('diem2__c')
  //         : null,
  //       diem3__c = studentData.containsKey('die3__c')
  //         ? (Decimal) studentData.get('diem3__c')
  //         : null,
  //       gender__c = (String) studentData.get('gender'),
  //       grade__c = gradeRecord.Id
  //     );
  //     System.debug('student: ' + student);
  //     insert student;
  //     return student.Id;
  //   } catch (Exception e) {
  //     System.debug(e.getMessage());
  //     return null;
  //   }
  // }

  @AuraEnabled
  public static String addStudent(
    String name,
    String firstName,
    String lastName,
    Date birthday,
    Decimal diem1,
    Decimal diem2,
    Decimal diem3,
    String gender,
    String grade
  ) {
    // Grade__c gradeRecord = [
    //     SELECT Id
    //     FROM Grade__c
    //     WHERE Id = :grade
    //     LIMIT 1
    //   ];
      // System.debug('gradeRecord: ' + gradeRecord);
      Student__c student = new Student__c(
        name = name,
        firstName__c = firstName,
        lastName__c = lastName,
        birthday__c = birthday,
        diem1__c = diem1,
        diem2__c = diem2,
        diem3__c = diem3,
        gender__c = gender,
        grade__c = grade
      );

      insert student;
      return student.Id;
  }

  @AuraEnabled
  public static String editStudent(
    String id,
    String name,
    String firstName,
    String lastName,
    Date birthday,
    Decimal diem1,
    Decimal diem2,
    Decimal diem3,
    String gender,
    String grade
  ) {
      Student__c student = [SELECT Id FROM Student__c WHERE Id = :id LIMIT 1];
      student.Name = name;
      student.firstName__c = firstName;
      student.lastName__c = lastName;
      student.birthday__c = birthday;
      student.diem1__c = diem1;
      student.diem2__c = diem2;
      student.diem3__c = diem3;
      student.gender__c = gender;
      student.grade__c = grade;

      update student;
      return student.Id;
  }

  @AuraEnabled
  public static string deleteStudent(String Id) {
    Student__c student = [SELECT Id FROM Student__c WHERE Id = :Id LIMIT 1];
    delete student;
    return student.Id;
  }

  @AuraEnabled
  public static List<String> deleteStudentByIds(List<String> ids) {
    List<Student__c> student = [SELECT Id FROM Student__c WHERE Id IN :ids];
    delete student;
    return ids;
  }

}

