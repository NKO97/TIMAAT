package de.bitgilde.TIMAAT;

/*
 Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

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
