/**
 * This class contains unit tests for validating the behavior of Apex classes
 * and triggers.
 *
 * Unit tests are class methods that verify whether a particular piece
 * of code is working properly. Unit test methods take no arguments,
 * commit no data to the database, and are flagged with the testMethod
 * keyword in the method definition.
 *
 * All test methods in an org are executed whenever Apex code is deployed
 * to a production org to confirm correctness, ensure code
 * coverage, and prevent regressions. All Apex classes are
 * required to have at least 75% code coverage in order to be deployed
 * to a production org. In addition, all triggers must have some code coverage.
 *
 * The @isTest class annotation indicates this class only contains test
 * methods. Classes defined with the @isTest annotation do not count against
 * the org size limit for all Apex scripts.
 *
 * See the Apex Language Reference for more information about Testing and Code Coverage.
 */
@isTest
private class StudentControllerTest {
  @TestSetup
  static void setupTestData() {
    // Tạo dữ liệu mẫu cho Grade__c
    List<Grade__c> grades = new List<Grade__c>();
    for (Integer i = 0; i < 10; i++) {
      grades.add(new Grade__c(Name = 'Grade ' + i));
    }
    insert grades;

    // Tạo dữ liệu mẫu cho Student__c
    List<Student__c> students = new List<Student__c>();
    for (Integer i = 0; i < 10; i++) {
      students.add(
        new Student__c(
          Name = 'Student First Name Last Name ' + i,
          firstName__c = 'First Name ' + i,
          lastName__c = 'Last Name ' + i,
          birthday__c = Date.today().addYears(-10),
          diem1__c = 8 + Math.mod(i, 3),
          diem2__c = 7 + Math.mod(i, 4),
          diem3__c = 6 + Math.mod(i, 5),
          gender__c = Math.mod(i, 2) == 0 ? 'Nam' : 'Nữ',
          grade__c = grades[i].Id
        )
      );
    }
    insert students;
  }

  // 4% test case getGrades
  @IsTest 
  static void testGrades() {
    Test.startTest();
    List<Grade__c> grades = StudentController.getGrades();
    Test.stopTest();
    System.assertEquals(10, grades.size());
  }

  @IsTest
  static void testGetStudentsPagination() {
    List<Student__c> student = [SELECT Id, Name FROM Student__c];
    String gradeId = [SELECT Id FROM Grade__c LIMIT 1].Id;
    System.debug('student: ' + student);
    Test.startTest();
    // Integer PageSize = 5;
    // Integer PageNumber = 1;
    // Integer paramPageNumber = (PageNumber - 1) * PageSize ;
    // * 1 lấy toàn bộ data
    // * 2. Truyền data: pageSize = 2, pageNumber = ((currentPage - 1) * PageSize), currentPage là trang click vào
    // case 2.1:  click trang đầu (pageSize = 2, pageNumber = 0 ) => output: totalRecords = 10, students.size = 2, totalPage = 5,
    // case 2.2:  click trang 2 (pageSize = 2, pageNumber = 2 ) => output: totalRecords = 10, students.size = 2, totalPage = 5,
    // ..
    // case 2.4:  click trang cuối (pageSize = 2, pageNumber = 10 ) => output: totalRecords = 10, students.size = 2, totalPage = 5
    
      // * 3. Truyền data: Search
    // case 3.1 lastName__c
      // case 3.1.1:  search lastName__c = ''
      // case 3.1.2:  search lastName__c = 'nhập sai'
      // case 3.1.3: Nhập gần giống: input: pageSize = 2, pageNumber = 0, search lastName__c bằng tên giống nhau ở các dòng đều có trong DB
      // case 3.1.4: Bằng chính xác 1 dòng trong DB  search
      // input: pageSize = 2, pageNumber = 0,  lastName__c = 'Last Name 1' => output: totalRecords = 1, totalPage = 1
    
    // case 3.2: search grade
      // 3.2.1 search grade có tồn tại
    // case 3.3: search fromDate
      // 3.3.1 search fromDate = ''
      // 3.3.3 search fromDate = 'co gia tri'
    // case 3.4: search toDate
      // 3.4.1 search toDate = ''
      // 3.4.1 search toDate = 'co gia tri'
    // case 3.5: search fromDate ToDate
      // case 3.5.1 search fromDate = '', toDate = ''
      // case 3.5.1 >= fromDate, <= toDate
    // cas 3.6 softField, sortOrder

     // * 1 lấy toàn bộ data
    System.assertEquals(10, student.size());
      // cas 2.1
    StudentController.PaginationStudent pagination = StudentController.getStudentsPagination(
      2,
      0,
      '', // name
      '', // grade
      '', // fromDate
      '', // toDate
      '', // sortField
      '' // sortOrder
    );
    System.AssertEquals(10, pagination.totalRecords);
    System.AssertEquals(2, pagination.students.size());
    System.AssertEquals(5, pagination.totalPage);
    // case 2.2:  click trang 2 (pageSize = 2, pageNumber = 2 ) => output: totalRecords = 10, students.size = 2, totalPage = 5,
    StudentController.PaginationStudent pagination2 = StudentController.getStudentsPagination(
      2,
      2,
      '', // name
      '', // grade
      '', // fromDate
      '', // toDate
      '', // sortField
      '' // sortOrder
    );
    System.AssertEquals(10, pagination2.totalRecords);
    System.AssertEquals(2, pagination2.students.size());
    System.AssertEquals(5, pagination2.totalPage);
    // case 2.4:  click trang cuối (pageSize = 2, pageNumber = 10 ) => output: totalRecords = 10, students.size = 2, totalPage = 5
    StudentController.PaginationStudent pagination2_4 = StudentController.getStudentsPagination(
      2,
      8,
      '', // name
      '', // grade
      '', // fromDate
      '', // toDate
      '', // sortField
      '' // sortOrder
    );
    System.AssertEquals(10, pagination2_4.totalRecords);
    System.AssertEquals(2, pagination2_4.students.size());
    System.AssertEquals(5, pagination2_4.totalPage);

    // * 3. Truyền data: Search
    // case 3.1 lastName__c
      // case 3.1.1:  search lastName__c = ''
      // case 3.1.2:  search lastName__c = 'nhập sai'
      StudentController.PaginationStudent pagination3_1_2 = StudentController.getStudentsPagination(
        2,
        0,
        'ABCDEF', // name
        '', // grade
        '', // fromDate
        '', // toDate
        '', // sortField
        '' // sortOrder
      );
      System.AssertEquals(0, pagination3_1_2.totalRecords);
      System.AssertEquals(0, pagination3_1_2.students.size());
      System.AssertEquals(0, pagination3_1_2.totalPage);
      // case 3.1.3: Nhập gần giống: input: pageSize = 2, pageNumber = 0, search lastName__c bằng tên giống nhau ở các dòng đều có trong DB
      StudentController.PaginationStudent pagination3_1_3 = StudentController.getStudentsPagination(
        2,
        0,
        'Last Name', // name
        '', // grade
        '', // fromDate
        '', // toDate
        '', // sortField
        '' // sortOrder
      );
      System.AssertEquals(10, pagination3_1_3.totalRecords);
      System.AssertEquals(2, pagination3_1_3.students.size());
      System.AssertEquals(5, pagination3_1_3.totalPage);

      // case 3.1.4: Bằng chính xác 1 dòng trong DB  search
      // input: pageSize = 2, pageNumber = 0,  lastName__c = 'Last Name 1' => output: totalRecords = 1, totalPage = 1
      StudentController.PaginationStudent pagination3_1_4 = StudentController.getStudentsPagination(
        2,
        0,
        'Last Name 1', // name
        '', // grade
        '', // fromDate
        '', // toDate
        '', // sortField
        '' // sortOrder
      );
      System.AssertEquals(1, pagination3_1_4.totalRecords);
      System.AssertEquals(1, pagination3_1_4.students.size());
      System.AssertEquals(1, pagination3_1_4.totalPage);


  // case 3.2: search grade
      // 3.2.1 search grade có tồn tại
      StudentController.PaginationStudent pagination3_3_1= StudentController.getStudentsPagination(
        2,
        0,
        '', // name
        gradeId, // grade
        '', // fromDate
        '', // toDate
        '', // sortField
        '' // sortOrder
      );
      System.AssertEquals(1, pagination3_3_1.totalRecords);
      System.AssertEquals(1, pagination3_3_1.students.size());
      System.AssertEquals(1, pagination3_3_1.totalPage);

    // case 3.3: search fromDate
    // 3.3.1 search fromDate = ''
    // 3.3.2 search fromDate = 'co gia tri'
    StudentController.PaginationStudent pagination3_3_2 = StudentController.getStudentsPagination(
      2,
      0,
      '', // name
      '', // grade
      '2012-12-16', // fromDate
      '', // toDate
      '', // sortField
      '' // sortOrder
    );
    System.AssertEquals(10, pagination3_3_2.totalRecords);
    System.AssertEquals(2, pagination3_3_2.students.size());
    System.AssertEquals(5, pagination3_3_2.totalPage);

    // case 3.4: search toDate
    // 3.4.1 search toDate = ''
    // 3.4.1 search toDate = 'co gia tri'
    StudentController.PaginationStudent pagination3_4_1 = StudentController.getStudentsPagination(
      2,
      0,
      '', // name
      '', // grade
      '', // fromDate
      '2026-12-16', // toDate
      '', // sortField
      '' // sortOrder
    );
    System.AssertEquals(10, pagination3_4_1.totalRecords);
    System.AssertEquals(2, pagination3_4_1.students.size());
    System.AssertEquals(5, pagination3_4_1.totalPage);
    // case 3.5: search fromDate ToDate
    // case 3.5.1 search fromDate = '', toDate = ''
    // case 3.5.1 >= fromDate, <= toDate
    StudentController.PaginationStudent pagination3_5_1 = StudentController.getStudentsPagination(
      2,
      0,
      '', // name
      '', // grade
      '2012-12-16', // fromDate
      '2026-12-16', // toDate
      '', // sortField
      '' // sortOrder
    );
    System.AssertEquals(10, pagination3_5_1.totalRecords);
    System.AssertEquals(2, pagination3_5_1.students.size());
    System.AssertEquals(5, pagination3_5_1.totalPage);

    // cas 3.6 softField, sortOrder
    StudentController.PaginationStudent pagination3_6_1 = StudentController.getStudentsPagination(
      2,
      0,
      '', // name
      '', // grade
      '', // fromDate
      '', // toDate
      'lastName__c', // sortField
      'DESC' // sortOrder
    );
    System.AssertEquals(10, pagination3_6_1.totalRecords);
    System.AssertEquals(2, pagination3_6_1.students.size());
    System.AssertEquals(5, pagination3_6_1.totalPage);

    Test.stopTest();
  }

  // 26% test case addStudent

  @IsTest
  static void testAddStudent() {
    Grade__c grade = [SELECT Id FROM Grade__c LIMIT 1];
    Test.startTest();
    String studentId = StudentController.addStudent(
      'Student 11',
      'First Name 11',
      'Last Name 11',
      Date.today().addYears(-10),
      8,
      7,
      6,
      'Nam',
      grade.Id
    );
    Test.stopTest();

    // Lấy dữ liệu từ database để kiểm tra tính đúng đắn
    Student__c createdStudent = [SELECT Id, Name, firstName__c, lastName__c, diem1__c, diem2__c, diem3__c, birthday__c, gender__c, grade__c 
                                 FROM Student__c 
                                 WHERE Id = :studentId];
    System.AssertEquals('Student 11', createdStudent.Name);
    System.AssertEquals('First Name 11', createdStudent.firstName__c);
    System.AssertEquals('Last Name 11', createdStudent.lastName__c);
    System.AssertEquals(Date.today().addYears(-10), createdStudent.birthday__c);
    System.AssertEquals(8, createdStudent.diem1__c);
    System.AssertEquals(7, createdStudent.diem2__c);
    System.AssertEquals(6, createdStudent.diem3__c);
    System.AssertEquals('Nam', createdStudent.gender__c);
    System.AssertEquals(grade.Id, createdStudent.grade__c);
  }
  // 20% test case updateStudent
  @IsTest
  static void testUpdateStudent() {
    Test.startTest();
    Student__c students = [
      SELECT Id, Name, firstName__c, lastName__c, diem1__c, diem2__c, diem3__c, birthday__c, gender__c, grade__c
      FROM Student__c
      LIMIT 1
    ];

    Grade__c grade = [SELECT Id FROM Grade__c LIMIT 1];
    
    String studentId = StudentController.editStudent(
      students.Id,
      'Update Name',
      'Update First Name',
      'Update Last Name',
      Date.today().addYears(-10),
      5,
      5,
      5,
      'Nữ',
      grade.Id
    );

    Test.stopTest();

    Student__c updatedStudent = [
      SELECT Id, Name, firstName__c, lastName__c, diem1__c, diem2__c, diem3__c, birthday__c, gender__c, grade__c 
      FROM Student__c
      WHERE Id = :studentId
    ];

    System.AssertEquals('Update Name', updatedStudent.Name);
    System.AssertEquals('Update First Name', updatedStudent.firstName__c);
    System.AssertEquals('Update Last Name', updatedStudent.lastName__c);
    System.AssertEquals(Date.today().addYears(-10), updatedStudent.birthday__c);
    System.AssertEquals(5, updatedStudent.diem1__c);
    System.AssertEquals(5, updatedStudent.diem2__c);
    System.AssertEquals(5, updatedStudent.diem3__c);
    System.AssertEquals('Nữ', updatedStudent.gender__c);
    System.AssertEquals(grade.Id, updatedStudent.grade__c);
  }


  //  5% test case deleteStudent
  @IsTest
  static void testDeleteStudent() {
    Test.startTest();
    Student__c students = [
      SELECT Id
      FROM Student__c
      LIMIT 1
    ];
    StudentController.deleteStudent(students.Id);
    Test.stopTest();

    List<Student__c> deletedStudent = [
      SELECT Id, Name, firstName__c, lastName__c, diem1__c, diem2__c, diem3__c, birthday__c
      FROM Student__c
      WHERE Id = :students.Id
    ];
    System.AssertEquals(0, deletedStudent.size());
  }

  // 7% test case deleteStudentByIds
 @IsTest
 static void testdeleteStudentByIds(){
  // cách 1
  // List<Id> studentIds = new List<Id>();
  // List<Student__c> students = [
  //   SELECT Id
  //   FROM Student__c
  //   LIMIT 3
  // ];

  // for( Student__c student : students){
  //   studentIds.add(student.Id);
  // }
  // cách 2
  Map<Id, Student__c> mapId = new Map<Id, Student__c>([SELECT Id FROM  Student__c LIMIT 3]);
  List<Id> studentIds =  new List<Id>(mapId.keySet());


  System.debug('studentIds: ' + studentIds);
  System.assertEquals(3,  studentIds.size());
  Test.startTest();
  StudentController.deleteStudentByIds(studentIds);
  Test.stopTest();
  List<Student__c> deletedStudent = [
    SELECT Id, Name, firstName__c, lastName__c, diem1__c, diem2__c, diem3__c, birthday__c
    FROM Student__c
    WHERE Id = :studentIds
    ];
    System.assertEquals(0, deletedStudent.size());
  }
}