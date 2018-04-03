/**
 * Context = wizard like command
 * @example:
 *    1. User typed a command
 *    2. System asked: Choose source of fund
 *.   3. User answered
 *.   4. System asked: Choose category
 *.   5. User answered
 *.   6. System told whether operation succeed/not.
 */

module.exports = [
  'expense',
  'income',
  'koreksi',
  'transfer',
  'set_investment',
  'void',
]
