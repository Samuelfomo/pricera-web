

export default class G{
  static confTable = "xf_";
  static operateTable = "pcr_";
  static appTable = "xa_";

 static internalError = { code: 'internal_error', message: 'Internal server error' };
 static missingRequired = { code: 'missing_required', message: 'Required fields are missing' };
  static invalidId = { code: 'invalid_id', message: 'Invalid ID format' };
  static invalidGuid = { code: 'invalid_guid', message: 'Invalid GUID format' };
  static invalidCode = { code: 'invalid_code', message: 'Invalid code format' };
}
