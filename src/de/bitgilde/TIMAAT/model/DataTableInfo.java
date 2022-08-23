package de.bitgilde.TIMAAT.model;

import java.util.List;

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
public class DataTableInfo {

	public int draw;
	public long recordsTotal;
	public long recordsFiltered;

	public List<?> data;


	public DataTableInfo() {

	}

	public DataTableInfo(int draw, long recordsTotal, long recordsFiltered, List<?> data) {
		this.draw = draw;
		this.recordsTotal = recordsTotal;
		this.recordsFiltered = recordsFiltered;
		this.data = data;
	}

}
