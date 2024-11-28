public with sharing class AccountController {
    
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts() {
        return [SELECT Id, Name, Industry, Phone FROM Account LIMIT 50];
    }

    // Phương thức tạo Account mới
    @AuraEnabled
    public static String createAccount(String accountName, String industry, String phone) {
        Account acc = new Account(Name = accountName, Industry = industry, Phone = phone);
        insert acc;
        return acc.Id;
    }

    // Phương thức xóa Account theo Id
    @AuraEnabled
    public static void deleteAccount(Id accountId) {
        Account acc = [SELECT Id FROM Account WHERE Id = :accountId];
        delete acc;
    }
}