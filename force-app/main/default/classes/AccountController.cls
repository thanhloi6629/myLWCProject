public with sharing class AccountController {
    
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts() {
        for( Contact contact : [SELECT Id, Name FROM Contact]) {
            System.debug("dđ",contact.id);
        }
        return [SELECT Id, Name, Industry, Phone FROM Account LIMIT 50];

//         List<Account> lstAcc = AccountController.getAccounts();
// system.debug('data: '+ lstAcc);
    }

    // Phương thức tạo Account mới
    @AuraEnabled
    public static String createAccount(String accountName, String industry, String phone) {
        Account acc = new Account(Name = accountName, Industry = industry, Phone = phone);
        insert acc;
        return acc.Id;
    }
    @AuraEnabled
    public static string testAPI(){
        Set<Id> accountIds = new Set<Id>();
        for( Contact contact : Trigger.new ) {
            accountIds.add(contact.AccountId);
        }
        Map<Id, Account> accountById = new Map<Id, Account>(
                [SELECT Id FROM Account WHERE Id IN :accountIds]
        )
        for( Contact contact : Trigger.new ) {
            Account account = accountById.get(contact.AccountId);
        }
    }

    // Phương thức xóa Accountt theo Id
    @AuraEnabled
    public static void deleteAccount(Id accountId) {
        Account acc = [SELECT Id FROM Account WHERE Id = :accountId];
        delete acc;
    }
}