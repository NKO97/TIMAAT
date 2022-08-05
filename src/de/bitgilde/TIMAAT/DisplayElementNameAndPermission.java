package de.bitgilde.TIMAAT;

/**
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
public class DisplayElementNameAndPermission {
  public int userAccountId;

  public String displayName;

  public int permissionId;

  public DisplayElementNameAndPermission(int userAccountId, String displayName, int permissionId) {
    this.userAccountId = userAccountId;
    this.displayName = displayName;
    this.permissionId = permissionId;
  };

  public String getDisplayName() {
    return this.displayName;
  }

}
