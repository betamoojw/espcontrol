#include <cassert>

#include "image_pipeline_policy.h"

using esphome::artwork_image::p4_pipeline_candidate_precedes;
using esphome::artwork_image::p4_pipeline_result_is_current;

int main() {
  // Modal work preempts queued tile work.
  assert(p4_pipeline_candidate_precedes(2, 20, 1, 10));
  assert(!p4_pipeline_candidate_precedes(1, 10, 2, 20));

  // Tiles at the same priority remain first-in, first-out.
  assert(p4_pipeline_candidate_precedes(1, 10, 1, 20));
  assert(!p4_pipeline_candidate_precedes(1, 20, 1, 10));

  // Cancelled and superseded downloads can never replace the visible image.
  assert(p4_pipeline_result_is_current(4, 4, false));
  assert(!p4_pipeline_result_is_current(4, 3, false));
  assert(!p4_pipeline_result_is_current(4, 4, true));
}
